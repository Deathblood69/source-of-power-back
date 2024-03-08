import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
import {Paginate, PaginateQuery} from 'nestjs-paginate'
import {FamilleDto} from './dto/famille.dto'
import {Famille} from './entities/famille.entity'
import {FamilleService} from './famille.service'
import {AuthGuard} from 'src/auth/guard/auth.guard'
import {HasRoles} from '../role/decorator/role.decorator'
import {UserRole} from '../role/enum/user.role.enum'

@ApiTags('famille')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@HasRoles(UserRole.JOUEUR)
@Controller('famille')
export class FamilleController {
  constructor(private readonly service: FamilleService) {}

  @Post()
  @ApiOperation({summary: "Création d'une famille"})
  @ApiBody({description: 'Famille', type: FamilleDto})
  @ApiResponse({status: 200, description: 'Création du famille réussie'})
  @ApiBadRequestResponse({description: 'Echec de la création du famille'})
  create(@Body() familleData: Partial<Famille>) {
    return this.service.create(familleData)
  }

  @Get()
  @ApiQuery({name: 'limit', type: Number, required: false})
  @ApiQuery({name: 'page', type: Number, required: false})
  @ApiQuery({name: 'search', type: String, required: false})
  @ApiQuery({name: 'sortBy', type: String, required: false})
  @ApiQuery({name: 'filter', type: String, required: false})
  @ApiOperation({summary: 'Liste des familles'})
  public findAll(@Paginate() query: PaginateQuery) {
    return this.service.findAll(query)
  }

  @Get(':id')
  @ApiOperation({summary: "Recherche d'une famille par id"})
  @ApiBody({description: 'Famille', type: FamilleDto})
  @ApiResponse({status: 200, description: 'Famille trouvée'})
  @ApiBadRequestResponse({description: 'Famille non trouvée'})
  findOne(@Param('id') id: string) {
    return this.service.findOne('id', id)
  }

  @Put()
  @ApiOperation({summary: "Mise à jour d'une famille"})
  @ApiBody({description: 'Famille', type: FamilleDto})
  @ApiResponse({status: 200, description: 'Mise à jour du famille réussie'})
  @ApiBadRequestResponse({description: 'Echec de la mise à jour du famille'})
  update(@Body() familleData: Partial<Famille>) {
    return this.service.update(familleData)
  }

  @Delete(':id')
  @ApiOperation({summary: "Recherche d'une famille par id"})
  @ApiResponse({status: 201, description: 'Famille supprimé'})
  @ApiBadRequestResponse({description: 'Famille non supprimé'})
  delete(@Param('id') id: string) {
    return this.service.delete(id)
  }
}
