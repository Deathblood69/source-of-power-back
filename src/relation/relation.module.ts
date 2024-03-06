import {Module} from '@nestjs/common'
import {JwtService} from '@nestjs/jwt'
import {TypeOrmModule} from '@nestjs/typeorm'
import {RelationController} from './relation.controller'
import {RelationService} from './relation.service'
import {Relation} from './entities/relation.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Relation])],
  controllers: [RelationController],
  providers: [RelationService, JwtService],
})
export class RelationModule {}
