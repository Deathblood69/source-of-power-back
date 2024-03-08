import {Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique} from 'typeorm'
import {AbstractEntity} from 'src/common/abstract/entity.abstract'
import {Famille} from '../../famille/entities/famille.entity'
import {Relation} from '../../relation/entities/relation.entity'
import {Genre} from '../enum/genre.enum'

@Entity()
@Unique(['nom', 'prenom', 'dateNaissance'])
export class Personnage extends AbstractEntity {
  @Column({name: 'nom', nullable: false})
  nom: string

  @Column({name: 'prenom', nullable: false})
  prenom: string

  @Column({name: 'dateNaissance', nullable: false})
  dateNaissance: string

  @Column({name: 'genre', nullable: true})
  genre: Genre

  @ManyToOne(() => Famille, (famille) => famille.personnages, {nullable: true})
  @JoinColumn({name: 'famille_id', referencedColumnName: 'id'})
  famille: Famille

  @OneToMany(() => Relation, (relation) => relation.personnage, {eager: true})
  relations: Relation[]
}
