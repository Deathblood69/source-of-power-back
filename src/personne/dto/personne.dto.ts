import {ApiProperty} from '@nestjs/swagger'

export class PersonneDto {
  @ApiProperty()
  nom: string

  @ApiProperty()
  prenom: string

  @ApiProperty()
  dateNaissance: string

  @ApiProperty()
  genre: string

  @ApiProperty()
  famille: string
}
