import {Module} from '@nestjs/common'
import {JwtService} from '@nestjs/jwt'
import {TypeOrmModule} from '@nestjs/typeorm'
import {PersonneController} from './personne.controller'
import {PersonneService} from './personne.service'
import {Personne} from './entities/personne.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Personne])],
  controllers: [PersonneController],
  providers: [PersonneService, JwtService],
})
export class PersonneModule {}
