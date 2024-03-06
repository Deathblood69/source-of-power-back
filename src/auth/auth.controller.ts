import {Body, Controller, Get, Post, Req, Res} from '@nestjs/common'
import {AuthService} from './auth.service'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import {LoginDto} from './dto/login.dto'
import {Request, Response} from 'express'
import {extractTokenFromHeader} from '../common/utils/tokenUtils'

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //Annotation Swagger
  @ApiOperation({summary: "Connexion de l'utilisateur"})
  @ApiBody({description: 'Information de connexion', type: LoginDto})
  @ApiResponse({status: 201, description: 'Authentification réussie'})
  @ApiBadRequestResponse({
    description: "Nom d'utilisateur ou mot de passe incorrect",
  })
  @Post('login')
  async login(
    @Res() res: Response,
    @Body() body: {username: string; password: string},
  ) {
    const tokenObject = await this.authService.login(
      body.username,
      body.password,
    )
    res.cookie('Authorization', encodeURIComponent(tokenObject.token), {
      httpOnly: true,
      secure: true,
    })
    res.send({username: body.username, roles: tokenObject.roles})
  }

  @ApiOperation({summary: "Déconnexion de l'utilisateur"})
  @ApiResponse({status: 201, description: 'Déconnexion réussie'})
  @ApiBadRequestResponse({
    description: 'Echec de la déconnexion',
  })
  @Get('logout')
  async logout(@Res() res: Response) {
    // Supprimer le cookie
    res.clearCookie('Authorization')
    res.send('Logged out')
  }

  /**
   * Permet à l'utilisateur de se reconnecter à l'application
   * @param res - Response
   * @param req - Request
   */
  @ApiOperation({summary: "Reconnexion automatique de l'utilisateur"})
  @Post('login/refresh')
  async isAuthenticated(@Res() res: Response, @Req() req: Request) {
    const token = extractTokenFromHeader(req)
    res.send(this.authService.decodeToken(token))
  }
}
