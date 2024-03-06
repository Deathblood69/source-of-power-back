import {ApiProperty} from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({default: 'd.dev'})
  username: string

  @ApiProperty({default: 'dev'})
  password: string
}
