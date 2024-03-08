import {Column, Entity, OneToMany} from 'typeorm'
import {AbstractEntity} from 'src/common/abstract/entity.abstract'
import {Personnage} from '../../personnage/entities/personnage.entity'

@Entity()
export class Maison extends AbstractEntity {
  @Column({name: 'nom', nullable: false, unique: true})
  nom: string

  @OneToMany(() => Personnage, (personnage) => personnage.maison, {eager: true})
  personnages: Personnage[]
}
