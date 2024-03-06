import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {ArrayOverlap, Repository} from 'typeorm'
import {User} from './entities/user.entity'
import {paginate, Paginated, PaginateQuery} from 'nestjs-paginate'
import * as bcrypt from 'bcrypt'
import * as _ from 'lodash'
import {isEqual} from 'lodash'
import {MessageException} from 'src/common/exception/message.exception'
import {UserRole} from '../role/enum/user.role.enum'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Find all users based on the provided query parameters.
   *
   * @param {PaginateQuery} query - The query parameters for pagination.
   * @return {Promise<Paginated<User>>} A promise that resolves to a paginated list
   * of users.
   */
  public async findAll(query: PaginateQuery): Promise<Paginated<User>> {
    return paginate(query, this.userRepository, {
      sortableColumns: [
        'lastName',
        'firstName',
        'username',
        'disabled',
        'roles',
      ],
      nullSort: 'last',
      searchableColumns: ['lastName', 'firstName', 'username', 'disabled'],
      select: ['id', 'lastName', 'firstName', 'username', 'disabled', 'roles'],
      filterableColumns: {
        lastName: true,
        firstName: true,
        username: true,
        password: true,
      },
      maxLimit: 0,
    })
  }

  /**
   * Finds a user based on a given attribute and value.
   *
   * @param {string} attribute - The attribute to search for.
   * @param {string} value - The value of the attribute to search for.
   * @return {Promise<User>} The user found.
   */
  async findOne(attribute: string, value: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {[attribute]: value},
    })
    if (!user) {
      throw new NotFoundException(`${attribute} '${value}' inconnu`)
    }
    return user
  }

  /**
   * Creates a new user with the provided data.
   *
   * @param {Partial<User>} userData - The data for creating the user.
   * @return {Promise<User>} - A promise that resolves to the created user.
   */
  async create(userData: Partial<User>): Promise<User> {
    if (!this.checkRegexPassword(userData))
      throw new UnauthorizedException(`REGEX_PASSWORD_INVALIDE`)
    this.isDisabled(userData)
    await this.checkLastRole(userData)

    try {
      await this.saltPassword(userData)
      userData.roles.sort((a, b) => a.localeCompare(b))
      return await this.userRepository.save(userData)
    } catch (error) {
      MessageException.readMessage(error, 'User')
    }
  }

  /**
   * Check if the provided password meets the specified criteria.
   *
   * @param {Partial<User>} userData - the user data containing the password to be checked
   * @return {boolean} true if the password meets the criteria, false otherwise
   */
  checkRegexPassword(userData: Partial<User>): boolean {
    if (userData.password) {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{12,30}$/
      return passwordRegex.test(userData.password)
    }
    return true
  }

  /**
   * Checks if the user data is disabled.
   *
   * @param {Partial<User>} userData - The user data to be checked.
   */
  isDisabled(userData: Partial<User>) {
    if (userData.disabled) {
      userData.disabledDate = Date.now()
    }
  }

  /**
   * Saves user data to the database.
   *
   * @param {Partial<User>} userData - The partial user data to be saved.
   * @return {Promise<User>} The saved user data.
   */
  async save(userData: Partial<User>): Promise<User> {
    return await this.userRepository.save(userData)
  }

  /**
   * Deletes a user by their ID.
   *
   * @param {string} userId - The ID of the user to delete.
   * @return {Promise<void>} A promise that resolves when the user is deleted.
   */
  async delete(userId: string): Promise<void> {
    const user = await this.findOne('id', userId)
    //Supprime-les roles pour checkLastRole.
    user.roles = []
    await this.checkLastRole(user)
    await this.userRepository.delete(userId)
  }

  /**
   * Check the last role of a user.
   *
   * @param {Partial<User>} partialUser - The user.
   * @return {Promise<boolean>} A boolean indicating whether the user has a last role or not.
   */
  async checkLastRole(partialUser: Partial<User>): Promise<boolean> {
    if (partialUser && partialUser.id) {
      const {roles: roles} = await this.userRepository.findOne({
        where: {id: partialUser.id},
      })
      const rolesPartialUser = Array.from(partialUser.roles.values()).sort()

      //compare la liste des rolesBDD de l'utilisateur avec la liste des roles du Partial<User>
      //si pas de diff → break ex bdd['ADMIN'] - partial['ADMIN']
      if (isEqual(rolesPartialUser, roles)) {
        return false
      }

      // si tous les rolesBDD sont dans Partial<User> → break ex bdd['ADMIN'] - partial['ADMIN']
      // si au moins un roleBDD n'est pas dans Partial<User> → gestionErreur ex bdd['ADMIN'] - partial['ADMIN']
      // récupère les roles concernés
      const rolesChange = roles.filter((r) => !rolesPartialUser.includes(r))

      if (rolesChange.length > 0) {
        // find role
        // count users with this role
        // si count user <= 1 -> add rolesExcept to list
        const lastRoles: UserRole[] = []
        for (const role of rolesChange) {
          const users = await this.userRepository.find({
            where: {roles: ArrayOverlap([role])},
          })
          if (users.length <= 1) {
            lastRoles.push(role)
          }
        }

        if (lastRoles.length > 0) {
          // HTTP EXCEPTION code 509
          throw new ConflictException(
            `LAST_ROLE_EXCEPTION_${lastRoles.map((value) => value)}`,
          )
        }
      }
      return false
    }
  }

  /**
   * Hashes the password in the given user data, if necessary.
   *
   * @param {Partial<User>} userData - The user data object.
   */
  private async saltPassword(userData: Partial<User>) {
    try {
      if (_.isUndefined(userData.id) || !_.isUndefined(userData.password)) {
        const saltRounds = 10
        userData.password = await bcrypt.hash(userData.password, saltRounds)
      }
    } catch (error) {
      throw new NotFoundException('PASSWORD_NOT_FOUND')
    }
  }
}
