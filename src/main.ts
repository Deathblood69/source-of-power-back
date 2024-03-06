import {NestFactory} from '@nestjs/core'
import {AppModule} from './common/app.module'
import {SwaggerModule} from '@nestjs/swagger'
import {ConfigService} from '@nestjs/config'
import {AppConfig} from './common/config/app.config'
import {Logger, ValidationPipe} from '@nestjs/common'
import {swaggerConfig} from './common/config/swagger.config'
import * as cookieParser from 'cookie-parser'
import {config} from 'dotenv'

async function bootstrap() {
  // LOGS
  const context = 'Source of Power'
  const logger = new Logger(context)

  // CREATION DE L'APPLICATION
  const app = await NestFactory.create(AppModule)

  // AJOUT DES CORS
  app.enableCors()

  // CHARGEMENT DE LA CONFIGURATION DE L'APP
  const configService = app.get(ConfigService)
  const appConfig = configService.get<AppConfig>('app')

  app.setGlobalPrefix(appConfig.globalPrefix)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )

  // INITIALISE SWAGGER
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('/api', app, document)

  // DEFINIT LE PREFIX DES ROUTES API
  app.setGlobalPrefix(appConfig.globalPrefix)

  // DEMARRAGE
  const server = await app.listen(appConfig.http.port, appConfig.http.host)
  if (appConfig.env === 'production') {
    server.setTimeout(appConfig.timeout)
  }

  // LOG APRES DEMARRAGE
  logger.debug(`L'environnement est en mode ${appConfig.env}`)
  logger.log(`Le serveur est disponible sur ${await app.getUrl()}/api`)

  // AJOUT DE LA GESTION DES COOKIES
  app.use(cookieParser())
}

config()
bootstrap().then()
