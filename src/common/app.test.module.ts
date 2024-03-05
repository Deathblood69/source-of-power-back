import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common'
import {ConfigModule} from '@nestjs/config'
import {PassportModule} from '@nestjs/passport'
import {JwtModule} from '@nestjs/jwt'
import {TypeOrmModule} from '@nestjs/typeorm'
import configs from 'src/common/config/index'
import {RefreshTokenMiddleware} from './middleware/refresh-token.middleware'
import {typeOrmConfig} from './config/database.config'
import {jwtConfig} from './config/auth.config'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
    }),
    PassportModule,
    JwtModule.register(jwtConfig),
    TypeOrmModule.forRoot(typeOrmConfig),
  ],
  exports: [JwtModule],
})
export class AppTestModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RefreshTokenMiddleware).exclude('auth/login').forRoutes('*')
  }
}
