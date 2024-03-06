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
import {MaisonDto} from './dto/maison.dto'
import {Maison} from './entities/maison.entity'
import {MaisonService} from './maison.service'
import {AuthGuard} from 'src/auth/guard/auth.guard'
import {HasRoles} from '../role/decorator/role.decorator'
import {UserRole} from '../role/enum/user.role.enum'

@ApiTags('maison')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@HasRoles(UserRole.JOUEUR)
@Controller('maison')
export class MaisonController {
  constructor(private readonly service: MaisonService) {}

  @Post()
  @ApiOperation({summary: "Création d'une maison"})
  @ApiBody({description: 'Maison', type: MaisonDto})
  @ApiResponse({status: 200, description: 'Création du maison réussie'})
  @ApiBadRequestResponse({description: 'Echec de la création du maison'})
  create(@Body() maisonData: Partial<Maison>) {
    return this.service.create(maisonData)
  }

  @Get()
  @ApiQuery({name: 'limit', type: Number, required: false})
  @ApiQuery({name: 'page', type: Number, required: false})
  @ApiQuery({name: 'search', type: String, required: false})
  @ApiQuery({name: 'sortBy', type: String, required: false})
  @ApiQuery({name: 'filter', type: String, required: false})
  @ApiOperation({summary: 'Liste des maisons'})
  public findAll(@Paginate() query: PaginateQuery) {
    return this.service.findAll(query)
  }

  @Get(':id')
  @ApiOperation({summary: "Recherche d'une maison par id"})
  @ApiBody({description: 'Maison', type: MaisonDto})
  @ApiResponse({status: 200, description: 'Maison trouvée'})
  @ApiBadRequestResponse({description: 'Maison non trouvée'})
  findOne(@Param('id') id: string) {
    return this.service.findOne('id', id)
  }

  @Put()
  @ApiOperation({summary: "Mise à jour d'une maison"})
  @ApiBody({description: 'Maison', type: MaisonDto})
  @ApiResponse({status: 200, description: 'Mise à jour du maison réussie'})
  @ApiBadRequestResponse({description: 'Echec de la mise à jour du maison'})
  update(@Body() maisonData: Partial<Maison>) {
    return this.service.update(maisonData)
  }

  @Delete(':id')
  @ApiOperation({summary: "Recherche d'une maison par id"})
  @ApiResponse({status: 201, description: 'Maison supprimé'})
  @ApiBadRequestResponse({description: 'Maison non supprimé'})
  delete(@Param('id') id: string) {
    return this.service.delete(id)
  }
}
