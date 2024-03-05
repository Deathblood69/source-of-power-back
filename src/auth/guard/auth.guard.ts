import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import {Reflector} from '@nestjs/core'
import {JwtService} from '@nestjs/jwt'
import {UserRole} from 'src/common/enum/user.role.enum'
import {
  extractPayloadFromVerifiedToken,
  extractTokenFromHeader,
} from '../../common/utils/tokenUtils'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  /**
   * Asynchronously checks if the user can activate the route.
   *
   * @param {ExecutionContext} context - The execution context object.
   * @return {Promise<boolean>} - A promise that resolves to a boolean indicating whether the user can activate the route.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    )

    if (!requiredRoles) {
      return true
    }

    const token = extractTokenFromHeader(context.switchToHttp().getRequest())
    const payload = extractPayloadFromVerifiedToken(token, this.jwtService)

    if (!requiredRoles.some((role) => payload?.roles?.includes(role))) {
      throw new ForbiddenException('FORBIDDEN_ACCESS')
    }
    return true
  }
}
