import {ApiProperty} from '@nestjs/swagger'
import {TypeRelation} from '../enum/typeRelation.enum'

export class RelationDto {
  @ApiProperty()
  personne: string

  @ApiProperty()
  type: TypeRelation

  @ApiProperty()
  relatedPersonne: string
}
