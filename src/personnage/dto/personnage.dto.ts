import {ApiProperty} from '@nestjs/swagger'

export class PersonnageDto {
  @ApiProperty()
  nom: string

  @ApiProperty()
  prenom: string

  @ApiProperty()
  dateNaissance: string

  @ApiProperty()
  maison: string
}
