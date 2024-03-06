import {Injectable} from '@nestjs/common'
import {UserRole} from './enum/user.role.enum'

@Injectable()
export class RoleService {
  async findAll() {
    return Object.values(UserRole)
  }
}
