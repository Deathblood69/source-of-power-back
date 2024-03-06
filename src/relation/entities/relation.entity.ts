import {Column, Entity, JoinColumn, ManyToOne} from 'typeorm'
import {AbstractEntity} from 'src/common/abstract/entity.abstract'
import {TypeRelation} from '../enum/typeRelation.enum'
import {Personnage} from '../../personnage/entities/personnage.entity'

@Entity()
export class Relation extends AbstractEntity {
  @ManyToOne(() => Personnage, (personnage) => personnage.relations)
  @JoinColumn({name: 'personnage_id'})
  personnage: Personnage

  @Column({name: 'type', nullable: false})
  type: TypeRelation

  @ManyToOne(() => Personnage, (personnage) => personnage.relations)
  @JoinColumn({name: 'related_personnage_id'})
  relatedPersonnage: Personnage
}
