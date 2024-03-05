import {UserRole} from 'src/common/enum/user.role.enum'
import {User} from 'src/user/entities/user.entity'
import {MigrationInterface, QueryRunner} from 'typeorm'

const user: Partial<User> = {
  lastName: 'Dev',
  firstName: 'Dev',
  username: 'd.dev',
  password: '$2b$10$IH4kATXWV90fb/PDA4.yFeCivdChs0qHHYPNiAxBwg4Jq/4U5ryc2',
  roles: [UserRole.ADMINISTRATEUR, UserRole.ENROLEUR],
}

export class InsertUser1709653138 implements MigrationInterface {
  name = 'InsertUser1709653138'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(user)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('username = :username', {username: user.username})
      .execute()
  }
}
