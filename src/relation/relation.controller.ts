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
import {RelationDto} from './dto/relation.dto'

import {RelationService} from './relation.service'
import {AuthGuard} from 'src/auth/guard/auth.guard'
import {HasRoles} from '../role/decorator/role.decorator'
import {UserRole} from '../role/enum/user.role.enum'
import {Relation} from './entities/relation.entity'

@ApiTags('relation')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@HasRoles(UserRole.JOUEUR)
@Controller('relation')
export class RelationController {
  constructor(private readonly service: RelationService) {}

  @Post()
  @ApiOperation({summary: "Création d'une relation"})
  @ApiBody({description: 'relation', type: RelationDto})
  @ApiResponse({status: 200, description: 'Création du relation réussie'})
  @ApiBadRequestResponse({description: 'Echec de la création du relation'})
  create(@Body() relationData: Partial<Relation>) {
    return this.service.create(relationData)
  }

  @Get()
  @ApiQuery({name: 'limit', type: Number, required: false})
  @ApiQuery({name: 'page', type: Number, required: false})
  @ApiQuery({name: 'search', type: String, required: false})
  @ApiQuery({name: 'sortBy', type: String, required: false})
  @ApiQuery({name: 'filter', type: String, required: false})
  @ApiOperation({summary: 'Liste des relations'})
  public findAll(@Paginate() query: PaginateQuery) {
    return this.service.findAll(query)
  }

  @Get(':id')
  @ApiOperation({summary: "Recherche d'une relation par id"})
  @ApiBody({description: 'relation', type: RelationDto})
  @ApiResponse({status: 200, description: 'relation trouvée'})
  @ApiBadRequestResponse({description: 'relation non trouvée'})
  findOne(@Param('id') id: string) {
    return this.service.findOne('id', id)
  }

  @Put()
  @ApiOperation({summary: "Mise à jour d'une relation"})
  @ApiBody({description: 'relation', type: RelationDto})
  @ApiResponse({status: 200, description: 'Mise à jour du relation réussie'})
  @ApiBadRequestResponse({description: 'Echec de la mise à jour du relation'})
  update(@Body() relationData: Partial<Relation>) {
    return this.service.update(relationData)
  }

  @Delete(':id')
  @ApiOperation({summary: "Recherche d'un personne par id"})
  @ApiResponse({status: 201, description: 'Personne supprimé'})
  @ApiBadRequestResponse({description: 'Personne non supprimé'})
  delete(@Param('id') id: string) {
    return this.service.delete(id)
  }
}
