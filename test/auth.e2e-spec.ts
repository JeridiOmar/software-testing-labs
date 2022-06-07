import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { SignUpDto } from '../src/auth/dto/sign-up-dto';
import { RoleEnum } from '../src/patient/entities/role.enum';
import { CivilStatusEnum } from '../src/patient/entities/civil-status.enum';
import { LoginDto } from '../src/auth/dto/login.dto';

describe('Authentification Module e2e test suite', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });
  it('/auth/create (POST)', async () => {
    const signUpDto: SignUpDto = {
      patient: {
        email: 'foulen.benfoulen@yahoo.com',
        role: RoleEnum.PATIENT,
        firstName: 'foulen',
        lastName: 'ben foulen',
        birthday: new Date('2000-05-01'),
        cin: '21111116',
        gender: 0,
        phoneNumber: '55479319',
        civilStatus: CivilStatusEnum.MARRIED,
        socialStatus: 'working',
        cnamId: 1800,
        password: 'azerty',
      },
      doctor: null,
      pharmacist: null,
      technician: null,
    };
    const result = {
      id: 1,
      email: 'foulen.benfoulen@yahoo.com',
      role: 'Patient',
      firstName: 'foulen',
      lastName: 'ben foulen',
      birthday: '2000-05-01T00:00:00.000Z',
      cin: '21111116',
      gender: 0,
      phoneNumber: '55479319',
      civilStatus: 'Married',
      socialStatus: 'working',
      cnamId: 1800,
      isEmailVerified: false,
    };
    return request(app.getHttpServer())
      .post('/auth/create')
      .send(signUpDto)
      .expect(201)
      .expect((res) => {
        expect(res.body).toMatchObject(result);
      });
  });
  describe('Authentication process', () => {
    let jwtToken: string;

    describe('AuthModule', () => {
      // assume test data includes user test@example.com with password 'password'
      const loginDto: LoginDto = {
        email: 'foulen.benfoulen@yahoo.com',
        password: 'azerty',
      };
      const wrongLoginDto = {
        email: 'foulen.benfoulen@yahoo.com',
        password: 'wrong',
      };
      it('authenticates user with valid credentials and provides a jwt token', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send(loginDto)
          .expect(201);

        // set jwt token for use in subsequent tests
        jwtToken = response.body.accessToken;
        expect(jwtToken).toMatch(
          /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
        ); // jwt regex
      });

      it('fails to authenticate user with an incorrect password', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send(wrongLoginDto)
          .expect(401);

        expect(response.body.accessToken).not.toBeDefined();
      });

      // assume test data does not include a nobody@example.com user
      it('fails to authenticate user that does not exist', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: 'nobody@example.com', password: 'test' })
          .expect(401);

        expect(response.body.accessToken).not.toBeDefined();
      });
      it('gets protected resource with jwt authenticated request', async () => {
        await request(app.getHttpServer())
          .get('/')
          .set('Authorization', `Bearer ${jwtToken}`)
          .expect(200);
      });
    });
  });
});
