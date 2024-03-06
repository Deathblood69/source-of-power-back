import {BeforeInsert, Column, Entity} from 'typeorm'
import {Exclude} from 'class-transformer'
import {AbstractEntity} from 'src/common/abstract/entity.abstract'
import {UserRole} from '../../role/enum/user.role.enum'

@Entity()
export class User extends AbstractEntity {
  @Column({name: 'last_name'})
  lastName: string

  @Column({name: 'first_name'})
  firstName: string

  @Column({name: 'username', unique: true})
  username: string

  @Column({name: 'password'})
  @Exclude()
  password: string

  @Column({
    type: 'enum',
    enum: UserRole,
    enumName: 'user_role_enum',
    array: true,
  })
  roles: UserRole[]

  @Column({name: 'is_disabled', default: false})
  disabled: boolean

  @Column({name: 'disabled_date', type: 'bigint', default: 0})
  disabledDate: number

  @Column({name: 'is_locked', default: false})
  isLocked: boolean

  @Column({name: 'date_lock', type: 'bigint', default: 0})
  dateLock: number

  @Column({name: 'login_attempts', default: 0})
  loginAttempts: number

  @BeforeInsert()
  sortRoles() {
    this.roles.sort((a, b) => a.localeCompare(b))
  }
}
