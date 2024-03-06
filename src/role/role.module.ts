import {Module} from '@nestjs/common'
import {RoleService} from './role.service'
import {RoleController} from './role.controller'
import {JwtService} from '@nestjs/jwt'

@Module({
  controllers: [RoleController],
  providers: [RoleService, JwtService],
})
export class RoleModule {}
