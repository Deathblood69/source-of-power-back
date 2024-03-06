import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import {Paginate, Paginated, PaginateQuery} from 'nestjs-paginate'
import {UserDTO} from './dto/user.dto'
import {User} from './entities/user.entity'
import {UserService} from './user.service'
import {AuthGuard} from 'src/auth/guard/auth.guard'

import {NoSelfUpdateUserGuard} from '../auth/guard/NoSelfUpdateUser.guard'
import {HasRoles} from '../role/decorator/role.decorator'
import {UserRole} from '../role/enum/user.role.enum'

@ApiTags('user')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@HasRoles(UserRole.ADMINISTRATEUR)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiQuery({name: 'limit', type: Number, required: false})
  @ApiQuery({name: 'page', type: Number, required: false})
  @ApiQuery({name: 'search', type: String, required: false})
  @ApiQuery({name: 'sortBy', type: String, required: false})
  @ApiQuery({name: 'filter', type: String, required: false})
  @ApiOperation({summary: 'Liste des utilisateurs'})
  public findAll(@Paginate() query: PaginateQuery): Promise<Paginated<User>> {
    return this.userService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne('id', id)
  }

  @Post()
  @UseGuards(NoSelfUpdateUserGuard)
  @ApiOperation({summary: 'Création User'})
  @ApiBody({description: 'User credentials', type: UserDTO})
  @ApiResponse({status: 201, description: 'Création User Success'})
  @ApiBadRequestResponse({description: 'User incorrect'})
  create(@Body() userData: Partial<User>): Promise<User> {
    return this.userService.create(userData)
  }

  @UseGuards(NoSelfUpdateUserGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.delete(id)
  }
}
