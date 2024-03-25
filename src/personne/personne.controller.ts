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
import {Paginate, Paginated, PaginateQuery} from 'nestjs-paginate'
import {PersonneDto} from './dto/personne.dto'
import {Personne} from './entities/personne.entity'
import {PersonneService} from './personne.service'
import {AuthGuard} from 'src/auth/guard/auth.guard'
import {HasRoles} from '../role/decorator/role.decorator'
import {UserRole} from '../role/enum/user.role.enum'

@ApiTags('personne')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@HasRoles(UserRole.JOUEUR)
@Controller('personne')
export class PersonneController {
  constructor(private readonly personneService: PersonneService) {}

  @Post()
  @ApiOperation({summary: "Création d'un personne"})
  @ApiBody({description: 'Personne', type: PersonneDto})
  @ApiResponse({status: 200, description: 'Création du personne réussie'})
  @ApiBadRequestResponse({description: 'Echec de la création du personne'})
  create(@Body() personneData: Partial<Personne>) {
    return this.personneService.create(personneData)
  }

  @Get()
  @ApiOperation({summary: 'Liste des membres'})
  @ApiQuery({name: 'limit', type: Number, required: false})
  @ApiQuery({name: 'page', type: Number, required: false})
  @ApiQuery({name: 'search', type: String, required: false})
  @ApiQuery({name: 'sortBy', type: String, required: false})
  @ApiQuery({name: 'filter', type: String, required: false})
  @ApiResponse({status: 200, description: 'Liste des membres'})
  public findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<Personne>> {
    return this.personneService.findAll(query)
  }

  @Get(':id')
  @ApiOperation({summary: "Recherche d'un personne par id"})
  @ApiBody({description: 'Personne', type: PersonneDto})
  @ApiResponse({status: 200, description: 'Personne trouvé'})
  @ApiBadRequestResponse({description: 'Personne non trouvé'})
  findOne(@Param('id') id: string) {
    return this.personneService.findOne('id', id)
  }

  @Put()
  @ApiOperation({summary: "Mise à jour d'un personne"})
  @ApiBody({description: 'Personne', type: PersonneDto})
  @ApiResponse({status: 200, description: 'Mise à jour du personne réussie'})
  @ApiBadRequestResponse({description: 'Echec de la mise à jour du personne'})
  update(@Body() personneData: Partial<Personne>) {
    return this.personneService.update(personneData)
  }

  @Delete(':id')
  @ApiOperation({summary: "Recherche d'un personne par id"})
  @ApiResponse({status: 201, description: 'Personne supprimé'})
  @ApiBadRequestResponse({description: 'Personne non supprimé'})
  delete(@Param('id') id: string) {
    return this.personneService.delete(id)
  }
}
