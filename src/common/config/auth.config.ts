import {JwtModuleOptions} from '@nestjs/jwt'

export const jwtConfig: JwtModuleOptions = {
  secret: process.env.JWT_SECRET_KEY || 'S3CR3T_K3Y',
}
