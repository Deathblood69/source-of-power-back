import {Module} from '@nestjs/common'
import {JwtService} from '@nestjs/jwt'
import {TypeOrmModule} from '@nestjs/typeorm'
import {MaisonController} from './maison.controller'
import {MaisonService} from './maison.service'
import {Maison} from './entities/maison.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Maison])],
  controllers: [MaisonController],
  providers: [MaisonService, JwtService],
})
export class MaisonModule {}
