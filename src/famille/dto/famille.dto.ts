import {ApiProperty} from '@nestjs/swagger'
import {PersonneDto} from '../../personne/dto/personne.dto'

export class FamilleDto {
  @ApiProperty()
  nom: string

  @ApiProperty()
  membres: PersonneDto[]
}
