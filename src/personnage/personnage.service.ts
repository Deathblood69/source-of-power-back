import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {Personnage} from './entities/personnage.entity'
import {paginate, PaginateQuery} from 'nestjs-paginate'

@Injectable()
export class PersonnageService {
  private readonly logger = new Logger('PersonnageService')

  constructor(
    @InjectRepository(Personnage)
    private readonly repository: Repository<Personnage>,
  ) {}

  /**
   * Saves entity data to the database.
   *
   * @param entityData - The partial entity data to be saved.
   * @return The saved entity data.
   */
  async create(entityData: Partial<Personnage>) {
    try {
      return await this.repository.save(entityData)
    } catch (e) {
      this.logger.error(e)
      throw new HttpException('ERREUR_CREATE', HttpStatus.CONFLICT)
    }
  }

  /**
   * Find all entities based on the provided query parameters.
   *
   * @param query - The query parameters for pagination.
   * @return A promise that resolves to a paginated list of entities.
   */
  public async findAll(query: PaginateQuery) {
    try {
      return paginate(query, this.repository, {
        sortableColumns: ['nom', 'prenom', 'dateNaissance'],
        defaultSortBy: [
          ['nom', 'ASC'],
          ['prenom', 'ASC'],
        ],
        nullSort: 'last',
        searchableColumns: ['nom', 'prenom', 'dateNaissance'],
        filterableColumns: {
          nom: true,
          prenom: true,
          age: true,
        },
        maxLimit: 0,
        relations: ['famille', 'relations'],
      })
    } catch (e) {
      this.logger.error(e)
      throw new HttpException('ERREUR_SEARCH', HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * Finds an entity based on a given attribute and value.
   *
   * @param attribute - The attribute to search for.
   * @param value - The value of the attribute to search for.
   * @return The entity found.
   */
  async findOne(attribute: string, value: string) {
    const entity = await this.repository.findOne({
      where: {[attribute]: value},
    })
    if (!entity) {
      const message = `ERREUR_FIND - ${attribute} '${value}' inconnu`
      throw new HttpException(message, HttpStatus.NOT_FOUND)
    }
    return entity
  }

  /**
   * Saves entity data to the database.
   *
   * @paramentityData - The partial entity data to be saved.
   * @return The saved entity data.
   */
  async update(entityData: Partial<Personnage>) {
    try {
      return await this.repository.save(entityData)
    } catch (e) {
      this.logger.error(e)
      throw new HttpException('ERREUR_UPDATE', HttpStatus.CONFLICT)
    }
  }

  /**
   * Deletes an entity by their ID.
   *
   * @param entityId - The ID of the entity to delete.
   * @return A promise that resolves when the entity is deleted.
   */
  async delete(entityId: string) {
    try {
      await this.repository.delete(entityId)
    } catch (e) {
      throw new HttpException('ERREUR_DELETE', HttpStatus.CONFLICT)
    }
  }
}
