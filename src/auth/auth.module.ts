import {Module} from '@nestjs/common'
import {AuthController} from './auth.controller'
import {AuthService} from './auth.service'
import {JwtStrategy} from './strategies/jwt.strategy'
import {LocalStrategy} from './strategies/local.strategy'
import {UserService} from 'src/user/user.service'
import {JwtService} from '@nestjs/jwt'
import {TypeOrmModule} from '@nestjs/typeorm'
import {User} from 'src/user/entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtService, JwtStrategy, LocalStrategy],
})
export class AuthModule {}
