import {TypeOrmModuleOptions} from '@nestjs/typeorm'

export const databaseConfig = {
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'db_admin',
  password: 'DBS3CR3T',
  database: 'database',
}

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: databaseConfig.type as any,
  host: process.env.DB_HOST || databaseConfig.host,
  port: parseInt(process.env.DB_PORT) || databaseConfig.port,
  username: process.env.DB_USERNAME || databaseConfig.username,
  password: process.env.DB_PASSWORD || databaseConfig.password,
  database: process.env.DB_DATABASE || databaseConfig.database,
  synchronize: Boolean(process.env.DB_SYNCHRONIZE) || false,
  autoLoadEntities: Boolean(process.env.AUTO_LOAD_ENTITIES_PG) || true,
}
