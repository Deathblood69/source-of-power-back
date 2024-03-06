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
import {PersonnageDto} from './dto/personnage.dto'
import {Personnage} from './entities/personnage.entity'
import {PersonnageService} from './personnage.service'
import {AuthGuard} from 'src/auth/guard/auth.guard'
import {HasRoles} from '../role/decorator/role.decorator'
import {UserRole} from '../role/enum/user.role.enum'

@ApiTags('personnage')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@HasRoles(UserRole.JOUEUR)
@Controller('personnage')
export class PersonnageController {
  constructor(private readonly personnageService: PersonnageService) {}

  @Post()
  @ApiOperation({summary: "Création d'un personnage"})
  @ApiBody({description: 'Personnage', type: PersonnageDto})
  @ApiResponse({status: 200, description: 'Création du personnage réussie'})
  @ApiBadRequestResponse({description: 'Echec de la création du personnage'})
  create(@Body() personnageData: Partial<Personnage>) {
    return this.personnageService.create(personnageData)
  }

  @Get()
  @ApiOperation({summary: 'Liste des personnages'})
  @ApiQuery({name: 'limit', type: Number, required: false})
  @ApiQuery({name: 'page', type: Number, required: false})
  @ApiQuery({name: 'search', type: String, required: false})
  @ApiQuery({name: 'sortBy', type: String, required: false})
  @ApiQuery({name: 'filter', type: String, required: false})
  @ApiResponse({status: 200, description: 'Liste des personnages'})
  public findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<Personnage>> {
    return this.personnageService.findAll(query)
  }

  @Get(':id')
  @ApiOperation({summary: "Recherche d'un personnage par id"})
  @ApiBody({description: 'Personnage', type: PersonnageDto})
  @ApiResponse({status: 200, description: 'Personnage trouvé'})
  @ApiBadRequestResponse({description: 'Personnage non trouvé'})
  findOne(@Param('id') id: string) {
    return this.personnageService.findOne('id', id)
  }

  @Put()
  @ApiOperation({summary: "Mise à jour d'un personnage"})
  @ApiBody({description: 'Personnage', type: PersonnageDto})
  @ApiResponse({status: 200, description: 'Mise à jour du personnage réussie'})
  @ApiBadRequestResponse({description: 'Echec de la mise à jour du personnage'})
  update(@Body() personnageData: Partial<Personnage>) {
    return this.personnageService.update(personnageData)
  }

  @Delete(':id')
  @ApiOperation({summary: "Recherche d'un personnage par id"})
  @ApiResponse({status: 201, description: 'Personnage supprimé'})
  @ApiBadRequestResponse({description: 'Personnage non supprimé'})
  delete(@Param('id') id: string) {
    return this.personnageService.delete(id)
  }
}
