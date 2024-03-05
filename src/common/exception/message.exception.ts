import {HttpException} from '@nestjs/common'

export class MessageException {
  static readMessage(error, entity: string) {
    const constraint = error.message.split('"')[1]
    if (constraint?.includes('IDX_')) {
      throw new HttpException(`DUPLICATE_INDEX_KEY - ${entity}`, 409)
    } else if (constraint?.includes('UQ_')) {
      throw new HttpException(`DUPLICATE_UNIQUE_KEY - ${entity}`, 409)
    }
    throw new HttpException(`UNKNOWN_ERROR`, 409)
  }
}
