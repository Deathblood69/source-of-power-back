import {ApiProperty} from '@nestjs/swagger'

export class UserDTO {
  @ApiProperty()
  lastName: string

  @ApiProperty()
  firstName: string

  @ApiProperty()
  username: string

  @ApiProperty()
  password: string
}
