import {DataSource} from 'typeorm'
import * as dotenv from 'dotenv'
import {databaseConfig} from './src/common/config/database.config'

dotenv.config()

export const AppDataSource = new DataSource({
  type: databaseConfig.type as any,
  host: process.env.DB_HOST || databaseConfig.host,
  port: parseInt(process.env.DB_PORT) || databaseConfig.port,
  username: process.env.DB_USERNAME || databaseConfig.username,
  password: process.env.DB_PASSWORD || databaseConfig.password,
  database: process.env.DB_DATABASE || databaseConfig.database,
  entities: ['dist/**/*.entity.js'],
  logging: true,
  synchronize: false,
  migrationsRun: false,
  migrations: ['dist/**/migrations/*.js'],
  migrationsTableName: 'history_migration',
})
