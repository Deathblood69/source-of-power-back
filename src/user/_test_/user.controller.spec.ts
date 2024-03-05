import {Test, TestingModule} from '@nestjs/testing'
import {INestApplication} from '@nestjs/common'
import {AppTestModule} from '../../app.test.module'
import {User} from '../entities/user.entity'
import {Repository} from 'typeorm'
import * as pactum from 'pactum'

let repository: Repository<User>
describe('User (pe2e)', () => {
  let app: INestApplication
  let moduleFixture: TestingModule
  let cookie

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppTestModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    // await testDatasetSeed();
    await app.init()
    await app.listen(3000)
    pactum.request.setBaseUrl('http://localhost:3000')
  })

  beforeEach(async () => {
    cookie = await pactum
      .spec()
      .post('/auth/login')
      .withBody({
        username: 'd.dev',
        password: 'dev',
      })
      .expectStatus(201)
      .returns((ctx) => {
        //console.log('cookie', ctx.res.headers['set-cookie']);
        return ctx.res.headers['set-cookie']
      })
  })

  afterAll(async () => {
    await app.close()
  })

  it('GET ALL', async () => {
    await pactum
      .spec()
      .get('/user')
      .withCookies(cookie[0])
      .expectStatus(200)
      .expectJsonLike({
        data: [
          {
            disabled: false,
            firstName: 'Dev',
            id: '52edb1d3-9129-46e3-b42b-b241c0876565',
            lastName: 'Dev',
            roles: [
              {id: '51fcb349-6c65-4f63-9de5-443173c356a5', name: 'ENROLEUR'},
              {
                id: '3f1166d4-b849-4fa0-8469-057d74457d08',
                name: 'ADMINISTRATEUR',
              },
            ],
            username: 'd.dev',
          },
          {
            disabled: false,
            firstName: 'Dev2',
            id: '52edb1d3-9129-46e3-b42b-b241c0876566',
            lastName: 'Dev2',
            roles: [
              {
                id: '3f1166d4-b849-4fa0-8469-057d74457d08',
                name: 'ADMINISTRATEUR',
              },
              {id: '51fcb349-6c65-4f63-9de5-443173c356a5', name: 'ENROLEUR'},
            ],
            username: 'd.devlock2',
          },
          {
            disabled: false,
            firstName: 'Dev3',
            id: '3398e192-bfc2-44ab-915c-74f57ccf1e79',
            lastName: 'Dev3',
            roles: [
              {id: '51fcb349-6c65-4f63-9de5-443173c356a5', name: 'ENROLEUR'},
              {
                id: '3f1166d4-b849-4fa0-8469-057d74457d08',
                name: 'ADMINISTRATEUR',
              },
            ],
            username: 'd.dev3',
          },
          {
            disabled: false,
            firstName: 'Dev4',
            id: '52edb1d3-9129-46e3-b42b-b241c0876575',
            lastName: 'Dev4',
            roles: [
              {
                id: '3f1166d4-b849-4fa0-8469-057d74457d08',
                name: 'ADMINISTRATEUR',
              },
              {id: '51fcb349-6c65-4f63-9de5-443173c356a5', name: 'ENROLEUR'},
            ],
            username: 'd.devlock',
          },
          {
            disabled: false,
            firstName: 'Dev5',
            id: '52edb1d3-9129-46e3-b42b-74f57ccf1e79',
            lastName: 'Dev5',
            roles: [
              {
                id: '3f1166d4-b849-4fa0-8469-057d74457d08',
                name: 'ADMINISTRATEUR',
              },
              {id: '51fcb349-6c65-4f63-9de5-443173c356a5', name: 'ENROLEUR'},
            ],
            username: 'd.devlock3',
          },
        ],
        links: {
          current:
            'http://localhost:3000/user?page=1&limit=20&sortBy=lastName:ASC&sortBy=username:ASC&sortBy=disabled:ASC',
        },
        meta: {
          currentPage: 1,
          itemsPerPage: 20,
          sortBy: [
            ['lastName', 'ASC'],
            ['username', 'ASC'],
            ['disabled', 'ASC'],
          ],
          totalItems: 5,
          totalPages: 1,
        },
      })
  })

  it('CREATE OK', async () => {
    await pactum
      .spec()
      .post('/user')
      .withCookies(cookie[0])
      .withJson({
        lastName: 'test',
        firstName: 'test',
        username: 't.est',
        password: 'test',
        roles: [
          {
            id: '51fcb349-6c65-4f63-9de5-443173c356a5',
            name: 'ENROLEUR',
          },
        ],
      })
      .expectStatus(201)
      .expectJsonMatch({
        lastName: 'test',
        firstName: 'test',
        username: 't.est',
        roles: [
          {
            id: '51fcb349-6c65-4f63-9de5-443173c356a5',
            name: 'ENROLEUR',
          },
        ],
        disabled: false,
        disabledDate: '0',
        isLocked: false,
        dateLock: '0',
        loginAttempts: 0,
      })
      .expectJsonMatch('roles', [
        {
          id: '51fcb349-6c65-4f63-9de5-443173c356a5',
          name: 'ENROLEUR',
        },
      ])
  })

  it('CREATE NOK USERNAME EXIST', async () => {
    await pactum
      .spec()
      .post('/user')
      .withCookies(cookie[0])
      .withJson({
        lastName: 'dev',
        firstName: 'dev',
        username: 'd.dev',
        password: 'dev',
        roles: [
          {
            id: '51fcb349-6c65-4f63-9de5-443173c356a5',
            name: 'ENROLEUR',
          },
        ],
      })
      .expectStatus(409)
  })

  it('GET ID', async () => {
    await pactum
      .spec()
      .get(`/user/52edb1d3-9129-46e3-b42b-b241c0876565`)
      .withCookies(cookie[0])
      .expectStatus(200)
      .expectJsonMatch({
        id: '52edb1d3-9129-46e3-b42b-b241c0876565',
        lastName: 'Dev',
        firstName: 'Dev',
        username: 'd.dev',
        password:
          '$2b$10$IH4kATXWV90fb/PDA4.yFeCivdChs0qHHYPNiAxBwg4Jq/4U5ryc2',
        disabled: false,
        disabledDate: '0',
        isLocked: false,
        dateLock: '0',
        loginAttempts: 0,
        roles: [
          {
            id: '3f1166d4-b849-4fa0-8469-057d74457d08',
            name: 'ADMINISTRATEUR',
            description: '',
          },
          {
            id: '51fcb349-6c65-4f63-9de5-443173c356a5',
            name: 'ENROLEUR',
            description: '',
          },
        ],
      })
  })

  it('DEL ID', async () => {
    repository = moduleFixture.get('UserRepository')
    await repository.save({
      id: '3f1166d4-b849-4fa0-8469-057d74457d01',
      lastName: 'devdel',
      firstName: 'devdel',
      username: 'd.devdel',
      disabled: false,
      password: '$2b$10$IH4kATXWV90fb/PDA4.yFeCivdChs0qHHYPNiAxBwg4Jq/4U5ryc2',
      roles: [
        {
          id: '3f1166d4-b849-4fa0-8469-057d74457d08',
          name: 'ADMINISTRATEUR',
          description: '',
        },
        {
          id: '51fcb349-6c65-4f63-9de5-443173c356a5',
          name: 'ENROLEUR',
          description: '',
        },
      ],
    })

    await pactum
      .spec()
      .delete(`/user/3f1166d4-b849-4fa0-8469-057d74457d01`)
      .withCookies(cookie[0])
      .expectStatus(200)

    await new Promise((f) => setTimeout(f, 200))

    await pactum
      .spec()
      .get(`/user/3f1166d4-b849-4fa0-8469-057d74457d01`)
      .withCookies(cookie[0])
      .expectStatus(404)
  })

  //TODO checkLastRole
  //TODO DEL INVALIDE_ID
  //TODO CONFLICT_ROLE_USER
})
