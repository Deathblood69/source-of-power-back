import {Test, TestingModule} from '@nestjs/testing'

import {INestApplication} from '@nestjs/common'
import {AppTestModule} from '../../app.test.module'
import {User} from '../../user/entities/user.entity'
import {Repository} from 'typeorm'
import * as pactum from 'pactum'

let repository: Repository<User>
describe('Auth (pe2e)', () => {
  let app: INestApplication
  let moduleFixture: TestingModule

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppTestModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    // await testDatasetSeed();
    await app.init()
    await app.listen(3000)
    pactum.request.setBaseUrl('http://localhost:3000')
  })

  afterEach(async () => {
    await app.close()
  })

  it('Auth ok', () => {
    const user = {
      username: 'd.dev',
      password: 'dev',
    }

    return pactum
      .spec()
      .post('/auth/login')
      .withBody(user)
      .expectStatus(201)
      .expectBody(['ADMINISTRATEUR', 'ENROLEUR'])
  })

  it('login nok / bad user', async () => {
    const user = {
      username: 'd.d',
      password: 'dev',
    }
    return pactum
      .spec()
      .post('/auth/login')
      .withBody(user)
      .expectStatus(404)
      .expectBody({
        error: 'Not Found',
        message: "username 'd.d' inconnu",
        statusCode: 404,
      })
  })

  it('login nok / locked', async () => {
    const user = {
      username: 'd.devlock3',
      password: 'dev',
    }
    return pactum
      .spec()
      .post('/auth/login')
      .withBody(user)
      .expectStatus(406)
      .expectBody({
        error: 'Not Acceptable',
        message: 'ACCOUNT_LOCKED 999999999999999999',
        statusCode: 406,
      })
  })

  it('login nok / locked -> unlock', async () => {
    const user = {
      username: 'd.devlock',
      password: 'dev',
    }
    return pactum
      .spec()
      .post('/auth/login')
      .withBody(user)
      .expectStatus(201)
      .expectBody(['ADMINISTRATEUR', 'ENROLEUR'])
  })

  it('login nok / bad pwd -> lock', async () => {
    const user = {
      username: 'd.devlock2',
      password: 'd',
    }

    for (let i = 1; i < 5; i++) {
      await pactum
        .spec()
        .post('/auth/login')
        .withBody(user)
        .expectStatus(401)
        .expectJson({
          error: 'Unauthorized',
          message: `INCORRECT_PASSWORD : ${i}`,
          statusCode: 401,
        })
      await new Promise((f) => setTimeout(f, 200))
    }

    await pactum.spec().post('/auth/login').withBody(user).expectStatus(406)
  })

  it('login nok / bad pwd', async () => {
    const user = {
      username: 'd.dev',
      password: 'd',
    }
    return pactum
      .spec()
      .post('/auth/login')
      .withBody(user)
      .expectStatus(401)
      .expectBody({
        error: 'Unauthorized',
        message: 'INCORRECT_PASSWORD : 1',
        statusCode: 401,
      })
  })
})
