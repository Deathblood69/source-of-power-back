import * as bcrypt from 'bcrypt'
import {
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common'
import {JwtService} from '@nestjs/jwt'
import {UserService} from '../user/user.service'
import {User} from 'src/user/entities/user.entity'
import {UserRole} from '../common/enum/user.role.enum'
import {extractPayloadFromVerifiedToken} from '../common/utils/tokenUtils'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  /**
   * Asynchronously logs in the user.
   *
   * @param {string} username - The username of the user.
   * @param {string} password - The password of the user.
   * @return {object} - An object containing the token and roles of the user.
   */
  async login(username: string, password: string) {
    const user = await this.validateUser(username, password)
    const nameRoles = user.roles
    const payload = {username: user.username, roles: nameRoles}
    return {
      token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.COOKIE_EXPIRATION_TIME,
      }),
      roles: nameRoles,
    }
  }

  /**
   * Validates a user's credentials.
   *
   * @param {string} username - The username of the user.
   * @param {string} password - The password of the user.
   * @return {Promise<any>} - A promise that resolves to the authenticated user.
   */
  private async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne('username', username)

    await this.isLocked(user)

    if (user && (await this.comparePasswords(password, user.password))) {
      user.loginAttempts = 0
      user.dateLock = 0
      await this.userService.save(user)
      return user
    } else if (user) {
      user.loginAttempts++
      if (this.isAdmin(user) && user.loginAttempts >= 4) {
        user.isLocked = true
        user.dateLock = new Date().setMinutes(
          new Date().getMinutes() + Number(process.env.TIMEBAN),
        )
      }
      await this.userService.save(user)
      throw new UnauthorizedException(
        'INCORRECT_PASSWORD : ' + user.loginAttempts,
      )
    }

    return null
  }

  private isAdmin(user: User): boolean {
    const roles = user.roles
    return (
      roles.includes(UserRole.ADMINISTRATEUR) ||
      roles.includes(UserRole.ENROLEUR)
    )
  }

  /**
   * Compares two passwords and returns a boolean indicating if they match.
   *
   * @param {string} enteredPassword - The password entered by the user.
   * @param {string} storedPassword - The password stored in the database.
   * @return {Promise<boolean>} - A promise that resolves to a boolean indicating if the passwords match.
   */
  private async comparePasswords(
    enteredPassword: string,
    storedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, storedPassword)
  }

  /**
   * Checks if the user is locked and performs necessary actions if they are.
   *
   * @param {User} user - The user object to check.
   */
  private async isLocked(user: User) {
    if (user.isLocked) {
      if (user.dateLock > Date.now()) {
        throw new NotAcceptableException(`ACCOUNT_LOCKED ${user.dateLock}`)
      } else {
        user.isLocked = false
        user.dateLock = 0
        await this.userService.save(user)
      }
    }
  }

  /**
   * Permet de decoder le token
   * @param token - Le token d'authentification
   */
  decodeToken(token: string): {username: string; roles: string[]} {
    const {username, roles} = extractPayloadFromVerifiedToken(
      token,
      this.jwtService,
    )
    return {username, roles}
  }
}
