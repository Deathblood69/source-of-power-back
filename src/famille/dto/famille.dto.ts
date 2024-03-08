import {ApiProperty} from '@nestjs/swagger'
import {PersonnageDto} from '../../personnage/dto/personnage.dto'

export class FamilleDto {
  @ApiProperty()
  nom: string

  @ApiProperty()
  membres: PersonnageDto[]
}
