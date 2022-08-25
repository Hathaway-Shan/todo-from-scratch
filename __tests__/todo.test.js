const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const mockUser = {
  first_name: 'Test',
  last_name: 'User',
  email: 'test@example.com',
  password: '123456',
};

const registerAndLogin = async (userProps = {}) => {
  const agent = request.agent(app);
  const res = await agent
    .post('/api/v1/users')
    .send({ ...mockUser, ...userProps });
  const user = res.body;
  return [agent, user];
};

describe('users', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('#get /me returns the currently logged in user', async () => {
    const [agent, user] = await registerAndLogin();
    const res = await agent.get('/api/v1/users/me');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      ...user,
      exp: expect.any(Number),
      iat: expect.any(Number),
    });
  });
  it('#post /todos creates a todo for an authenticated user', async () => {
    const [agent, user] = await registerAndLogin();
    const res = await agent.post('/api/v1/todos').send({
      content: 'walk the car',
    });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      user_id: user.id,
      content: 'walk the car',
      finished: false,
    });
  });
});

afterAll(() => {
  pool.end();
});
