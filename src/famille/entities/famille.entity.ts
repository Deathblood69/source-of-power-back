import {Column, Entity, OneToMany} from 'typeorm'
import {AbstractEntity} from 'src/common/abstract/entity.abstract'
import {Personne} from '../../personne/entities/personne.entity'

@Entity()
export class Famille extends AbstractEntity {
  @Column({name: 'nom', nullable: false, unique: true})
  nom: string

  @OneToMany(() => Personne, (personne) => personne.famille, {eager: true})
  membres: Personne[]
}
