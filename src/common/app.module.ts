import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common'
import {ConfigModule} from '@nestjs/config'
import {PassportModule} from '@nestjs/passport'
import {JwtModule} from '@nestjs/jwt'
import {TypeOrmModule} from '@nestjs/typeorm'
import configs from 'src/common/config/index'
import {RefreshTokenMiddleware} from './middleware/refresh-token.middleware'
import {typeOrmConfig} from './config/database.config'
import {jwtConfig} from './config/auth.config'
import {RoleModule} from '../role/role.module'
import {UserModule} from '../user/user.module'
import {AuthModule} from '../auth/auth.module'
import {PersonneModule} from '../personne/personne.module'
import {FamilleModule} from '../famille/famille.module'
import {RelationModule} from '../relation/relation.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
    }),
    PassportModule,
    JwtModule.register(jwtConfig),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    RoleModule,
    UserModule,
    PersonneModule,
    FamilleModule,
    RelationModule,
  ],
  exports: [JwtModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RefreshTokenMiddleware).exclude('auth/login').forRoutes('*')
  }
}
