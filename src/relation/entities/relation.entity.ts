import {Column, Entity, JoinColumn, ManyToOne} from 'typeorm'
import {AbstractEntity} from 'src/common/abstract/entity.abstract'
import {TypeRelation} from '../enum/typeRelation.enum'
import {Personne} from '../../personne/entities/personne.entity'

@Entity()
export class Relation extends AbstractEntity {
  @ManyToOne(() => Personne, (personne) => personne.relations)
  @JoinColumn({name: 'personne_id'})
  personne: Personne

  @Column({name: 'type', nullable: false})
  type: TypeRelation

  @ManyToOne(() => Personne, (personne) => personne.relations)
  @JoinColumn({name: 'related_personne_id'})
  relatedPersonne: Personne
}
