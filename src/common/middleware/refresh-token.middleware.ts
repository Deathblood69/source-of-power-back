import {Injectable, NestMiddleware} from '@nestjs/common'
import {JwtService} from '@nestjs/jwt'
import {NextFunction, Request, Response} from 'express'
import {
  extractPayloadFromVerifiedToken,
  extractTokenFromHeader,
} from '../utils/tokenUtils'

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Fonction middleware qui extrait le nom d’utilisateur et les rôles.
   * le jeton JWT fourni dans le cookie de demande, vérifie le jeton, et
   * génère un nouveau jeton JWT avec un nom d’utilisateur et des rôles mis à jour.
   * le jeton est alors défini comme la valeur du cookie d’autorisation dans la
   * Réponse. Si une erreur se produit au cours du processus, l’autorisation
   * le cookie est effacé et la réponse envoie la chaîne 'EXPIRED_TOKEN'.
   *
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @param {NextFunction} next - The next middleware function.
   */
  use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = extractTokenFromHeader(req)
      const {username, roles} = extractPayloadFromVerifiedToken(
        token,
        this.jwtService,
      )

      const jwt = this.jwtService.sign(
        {username: username, roles: roles},
        {expiresIn: process.env.COOKIE_EXPIRATION_TIME},
      )
      res.cookie('Authorization', encodeURIComponent(jwt), {
        httpOnly: true,
        secure: true,
      })
      next()
    } catch {
      res.clearCookie('Authorization')
      res.status(401).send('EXPIRED_TOKEN')
    }
  }
}
