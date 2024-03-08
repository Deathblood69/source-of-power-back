import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'

import {paginate, PaginateQuery} from 'nestjs-paginate'
import {Relation} from './entities/relation.entity'
import {TypeRelation} from './enum/typeRelation.enum'

@Injectable()
export class RelationService {
  private readonly logger = new Logger('PersonnageService')

  constructor(
    @InjectRepository(Relation)
    private readonly repository: Repository<Relation>,
  ) {}

  /**
   * Saves entity data to the database.
   *
   * @param entityData - The partial entity data to be saved.
   * @return The saved entity data.
   */
  async create(entityData: Partial<Relation>) {
    try {
      const otherRelation: Partial<Relation> = {
        personnage: entityData.relatedPersonnage,
        relatedPersonnage: entityData.personnage,
      }
      switch (entityData.type) {
        case TypeRelation.PARENT:
          otherRelation.type = TypeRelation.ENFANT
          break
        case TypeRelation.ENFANT:
          otherRelation.type = TypeRelation.PARENT
          break
        default:
          otherRelation.type = entityData.type
      }
      await this.repository.save(otherRelation)
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
        sortableColumns: ['type'],
        defaultSortBy: [['type', 'ASC']],
        nullSort: 'last',
        searchableColumns: ['type'],
        filterableColumns: {
          nom: true,
          chef: true,
        },
        maxLimit: 0,
        relations: ['personnages'],
      })
    } catch (e) {
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
      throw new HttpException(
        `ERREUR_FIND - ${attribute} '${value}' inconnu`,
        HttpStatus.NOT_FOUND,
      )
    }
    return entity
  }

  /**
   * Saves entity data to the database.
   *
   * @paramentityData - The partial entity data to be saved.
   * @return The saved entity data.
   */
  async update(entityData: Partial<Relation>) {
    try {
      return await this.repository.save(entityData)
    } catch (e) {
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
