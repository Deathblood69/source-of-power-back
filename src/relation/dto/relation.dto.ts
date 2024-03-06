import {ApiProperty} from '@nestjs/swagger'
import {TypeRelation} from '../enum/typeRelation.enum'

export class RelationDto {
  @ApiProperty()
  personnage: string

  @ApiProperty()
  type: TypeRelation

  @ApiProperty()
  relatedPersonnage: string
}
