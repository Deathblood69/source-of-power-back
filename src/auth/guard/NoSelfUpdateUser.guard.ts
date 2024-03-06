import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import {JwtService} from '@nestjs/jwt'
import {User} from '../../user/entities/user.entity'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {
  extractPayloadFromVerifiedToken,
  extractTokenFromHeader,
} from '../../common/utils/tokenUtils'

@Injectable()
export class NoSelfUpdateUserGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Asynchronously checks if the user can activate the route.
   *
   * @param {ExecutionContext} context - The execution context object.
   * @return {Promise<boolean>} - A promise that resolves to a boolean indicating whether the user can activate the route.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    //recupération de l'id user à modifier
    const id = req.params.id || req.body.id

    //recupération de l'id user à connecter
    const token = extractTokenFromHeader(req)
    const {username} = extractPayloadFromVerifiedToken(token, this.jwtService)

    const user: User = await this.userRepository.findOneBy({
      username,
    })

    //comparaison
    if (id === user.id) {
      throw new ForbiddenException('NO_SELF_UPDATE')
    }
    return true
  }
}
