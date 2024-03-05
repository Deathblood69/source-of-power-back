import {DocumentBuilder} from '@nestjs/swagger'

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Source of Power')
  .setDescription("Documentation de l'API documentation de SOP")
  .setVersion('0.0.1')
  .build()
