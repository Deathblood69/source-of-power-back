import {ApiProperty} from '@nestjs/swagger'
import {PersonnageDto} from '../../personnage/dto/personnage.dto'

export class MaisonDto {
  @ApiProperty()
  nom: string

  @ApiProperty()
  chef: PersonnageDto[]

  @ApiProperty()
  famille: PersonnageDto[]
}
