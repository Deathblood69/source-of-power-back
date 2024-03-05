import {Injectable, UnauthorizedException} from '@nestjs/common'
import {Strategy} from 'passport-local'
import {PassportStrategy} from '@nestjs/passport'
import {UserService} from '../../user/user.service'
import * as bcrypt from 'bcrypt'

/**
 * Local strategy for authentication.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super()
  }

  /**
   * Validates the given username and password.
   *
   * @param {string} username - The username to validate.
   * @param {string} password - The password to validate.
   * @return {Promise<any>} A promise that resolves with the validated user if the username and password are valid.
   */
  async validate(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne('username', username)
    if (!user) {
      throw new UnauthorizedException('INVALIDE_USERNAME_OR_PASSWORD')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('INVALIDE_USERNAME_OR_PASSWORD')
    }
    return user
  }
}
