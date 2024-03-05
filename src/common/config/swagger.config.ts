import {DocumentBuilder} from '@nestjs/swagger'

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Source of Power')
  .setDescription("Documentation de l'API documentation de SOP")
  .setVersion('0.0.1')
  .addTag('auth', 'Authentification')
  .addTag('user', 'Gestion des utilisateurs')
  .build()
