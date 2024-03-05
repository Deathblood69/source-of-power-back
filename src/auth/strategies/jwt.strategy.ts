import {Injectable} from '@nestjs/common'
import {PassportStrategy} from '@nestjs/passport'
import {ExtractJwt, Strategy} from 'passport-jwt'
import {UserService} from '../../user/user.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'S3CR3T_K3Y',
    })
  }

  /**
   * Validates the payload.
   *
   * @param {any} payload - The payload to be validated.
   * @return {Promise<any>} A promise that resolves with the validated payload.
   */
  async validate(payload: any): Promise<any> {
    const user = await this.userService.findOne('id', payload.sub)

    if (!user) {
      return null
    }

    const {id, password: _, ...result} = user
    return user
  }
}
