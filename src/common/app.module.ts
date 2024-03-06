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
import {PersonnageModule} from '../personnage/personnage.module'
import {MaisonModule} from '../maison/maison.module'
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
    PersonnageModule,
    MaisonModule,
    RelationModule,
  ],
  exports: [JwtModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RefreshTokenMiddleware).exclude('auth/login').forRoutes('*')
  }
}
