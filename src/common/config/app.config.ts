import {registerAs} from '@nestjs/config'
import {config} from 'dotenv'

config()

interface HttpConfig {
  host: string
  port: number
}

export interface AppConfig {
  name: string
  globalPrefix: string
  env: string
  timeout: number
  http: HttpConfig
  debug: boolean
}

export default registerAs(
  'app',
  (): AppConfig => ({
    env: process.env.NODE_ENV || 'development',
    name: process.env.APP_NAME || 'nest-api',
    globalPrefix: process.env.APP_GLOBAL_PREFIX || 'api/v1',
    timeout: parseInt(process.env.APP_TIMEOUT) || 7000,
    http: {
      host: process.env.HOST_APP || '0.0.0.0',
      port: parseInt(process.env.PORT_APP) || 3000,
    },
    debug: Boolean(process.env.DEBUG_APP) || false,
  }),
)
