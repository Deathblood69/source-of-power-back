import {Module} from '@nestjs/common'
import {JwtService} from '@nestjs/jwt'
import {TypeOrmModule} from '@nestjs/typeorm'
import {FamilleController} from './famille.controller'
import {FamilleService} from './famille.service'
import {Famille} from './entities/famille.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Famille])],
  controllers: [FamilleController],
  providers: [FamilleService, JwtService],
})
export class FamilleModule {}
