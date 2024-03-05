import {UserRole} from 'src/common/enum/user.role.enum'
import {User} from 'src/user/entities/user.entity'
import {MigrationInterface, QueryRunner} from 'typeorm'

export class InsertData1706082616361 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {

    const user = new User()
    user.lastName = 'Dev'
    user.firstName = 'Dev'
    user.username = 'd.dev'
    user.password =
      '$2b$10$IH4kATXWV90fb/PDA4.yFeCivdChs0qHHYPNiAxBwg4Jq/4U5ryc2'
    user.roles = [UserRole.ADMINISTRATEUR]
    await queryRunner.manager.save(user)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('username = :username', {username: 'd.dev'})
      .execute()
  }
}
