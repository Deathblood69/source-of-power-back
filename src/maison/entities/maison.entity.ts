import {Column, Entity, JoinColumn, OneToMany, OneToOne} from 'typeorm'
import {AbstractEntity} from 'src/common/abstract/entity.abstract'
import {Personnage} from '../../personnage/entities/personnage.entity'

@Entity()
export class Maison extends AbstractEntity {
  @Column({name: 'nom', nullable: false, unique: true})
  nom: string

  @OneToOne(() => Personnage, (personnage) => personnage.maison)
  @JoinColumn({name: 'chef_id', referencedColumnName: 'id'})
  chef: Personnage

  @OneToMany(() => Personnage, (personnage) => personnage.maison)
  personnages: Personnage[]
}
