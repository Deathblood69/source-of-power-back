import {Module} from '@nestjs/common'
import {JwtService} from '@nestjs/jwt'
import {TypeOrmModule} from '@nestjs/typeorm'
import {PersonnageController} from './personnage.controller'
import {PersonnageService} from './personnage.service'
import {Personnage} from './entities/personnage.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Personnage])],
  controllers: [PersonnageController],
  providers: [PersonnageService, JwtService],
})
export class PersonnageModule {}
