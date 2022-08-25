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
  it('#post /todos returns a 401 to an unauthenticated user', async () => {
    const res = await request(app).post('/api/v1/todos').send({
      content: 'wash the dog',
    });
    expect(res.status).toBe(401);
  });
  it('#get returns a list of an authenticated users todos', async () => {
    const [agent, user] = await registerAndLogin();
    const firstRes = await agent.post('/api/v1/todos').send({
      content: 'walk the car',
    });
    expect(firstRes.status).toBe(200);
    expect(firstRes.body.user_id).toEqual(user.id);

    const res = await agent.get('/api/v1/todos');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        id: '1',
        user_id: '1',
        content: 'walk the car',
        finished: false,
      },
    ]);
  });
  it('#get /todos returns a 401 to an unauthenticated user', async () => {
    const res = await request(app).get('/api/v1/todos');
    expect(res.status).toBe(401);
  });
  it('#put /api/v1/todos/:id updates an existing todo', async () => {
    const [agent] = await registerAndLogin();
    const testTodo = await agent
      .post('/api/v1/todos')
      .send({ content: 'complete this todo' });
    expect(testTodo.status).toBe(200);
    const res = await agent
      .put(`/api/v1/todos/${testTodo.body.id}`)
      .send({ finished: true });
    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body.finished).toEqual(true);
  });
});

afterAll(() => {
  pool.end();
});
