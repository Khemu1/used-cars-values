import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Auth System', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles sign up rquest', async () => {
    const email = 'test2@test.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'test' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body as { id: number; email: string };
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });

  it('sign up as a new user then get the current user', async () => {
    const email = 'test3@test.com';
    const res = await request(app.getHttpServer()).post('/auth/signup').send({ email, password: 'test' }).expect(201);

    const cookie = res.get('Set-Cookie') || [];

    await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200)
      .then((res) => {
        const { id, email } = res.body as { id: number; email: string };
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
