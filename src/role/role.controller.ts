import {Controller, Get, UseGuards} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import {AuthGuard} from '../auth/guard/auth.guard'
import {HasRoles} from './decorator/role.decorator'
import {UserRole} from '../common/enum/user.role.enum'
import {RoleService} from './role.service'

@ApiTags('role')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@HasRoles(UserRole.ADMINISTRATEUR)
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({summary: 'Liste des rôles'})
  @ApiResponse({
    status: 200,
    description: 'Liste des rôles récupérées avec succès',
  })
  @ApiBadRequestResponse({
    description: 'Echec de la récupération des rôles',
  })
  @Get()
  public async findAll() {
    return await this.roleService.findAll()
  }
}
