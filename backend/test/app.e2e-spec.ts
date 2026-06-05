import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;
  const email = `test_${Date.now()}@test.com`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/register - creates a new user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password: 'pass123' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email', email);
    expect(res.body).not.toHaveProperty('password');
  });

  it('POST /auth/register - rejects duplicate email', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password: 'pass123' });

    expect(res.status).toBe(409);
  });

  it('POST /auth/login - returns token on valid credentials', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: 'pass123' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('access_token');
  });

  it('POST /auth/login - rejects wrong password', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: 'wrongpass' });

    expect(res.status).toBe(401);
  });

  it('GET /cookies - requires auth token', async () => {
    const res = await request(app.getHttpServer()).get('/cookies');

    expect(res.status).toBe(401);
  });

  it('GET /cookies - works with valid token', async () => {
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: 'pass123' });

    const token = loginRes.body.access_token;
    const res = await request(app.getHttpServer())
      .get('/cookies')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});