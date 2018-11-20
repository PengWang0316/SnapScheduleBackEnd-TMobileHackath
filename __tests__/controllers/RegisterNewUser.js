import RegisterNewUserController from '../../src/controllers/RegisterNewUser';

jest.mock('bcryptjs', () => ({ hash: jest.fn().mockResolvedValue('hash') }));
jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/models/User', () => ({ registerNewUser: jest.fn().mockResolvedValue('result') }));

process.env.SALT_ROUNDS = 10;

describe('RegisterNewUser controller', () => {
  test('RegisterNewUser without any error', async () => {
    const { hash } = require('bcryptjs');
    const { error } = require('../../src/utils/Logger');
    const { registerNewUser } = require('../../src/models/User');

    const req = {
      body: {
        username: 'username',
        password: 'password',
        name: 'name',
        photo: 'photo',
      },
    };
    const res = { json: jest.fn() };

    await RegisterNewUserController(req, res);
    expect(hash).toHaveBeenCalledTimes(1);
    expect(hash).toHaveBeenLastCalledWith(req.body.password, 10);
    expect(registerNewUser).toHaveBeenCalledTimes(1);
    expect(registerNewUser).toHaveBeenLastCalledWith({ ...req.body, password: 'hash' });
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenLastCalledWith('result');
    expect(error).not.toHaveBeenCalled();
  });

  test('RegisterNewUser with bcryptjs error', async () => {
    const { hash } = require('bcryptjs');
    hash.mockRejectedValueOnce('');
    const { error } = require('../../src/utils/Logger');
    const { registerNewUser } = require('../../src/models/User');

    const req = {
      body: {
        username: 'username',
        password: 'password',
        name: 'name',
        photo: 'photo',
      },
    };
    const res = { json: jest.fn() };

    await RegisterNewUserController(req, res);
    expect(hash).toHaveBeenCalledTimes(2);
    expect(hash).toHaveBeenLastCalledWith(req.body.password, 10);
    expect(res.json).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
  });

  test('RegisterNewUser with model error', async () => {
    const { hash } = require('bcryptjs');
    const { error } = require('../../src/utils/Logger');
    const { registerNewUser } = require('../../src/models/User');
    registerNewUser.mockRejectedValueOnce('');

    const req = {
      body: {
        username: 'username',
        password: 'password',
        name: 'name',
        photo: 'photo',
      },
    };
    const res = { json: jest.fn() };

    await RegisterNewUserController(req, res);
    expect(hash).toHaveBeenCalledTimes(3);
    expect(hash).toHaveBeenLastCalledWith(req.body.password, 10);
    expect(registerNewUser).toHaveBeenCalledTimes(2);
    expect(registerNewUser).toHaveBeenLastCalledWith({ ...req.body, password: 'hash' });
    expect(res.json).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(2);
  });
});
