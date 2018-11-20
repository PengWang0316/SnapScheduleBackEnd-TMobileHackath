import LoginController from '../../src/controllers/Login';

jest.mock('bcryptjs', () => ({ compare: jest.fn().mockReturnValue(Promise.resolve(true)) }));
jest.mock('../../src/models/User', () => ({ fetchOneUser: jest.fn().mockReturnValue(Promise.resolve([{ password: 'password' }])) }));
jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/JWTUtil', () => ({ signJWT: jest.fn().mockReturnValue('JWT') }));

describe('Login controller', () => {
  test('fetchOneUser without database error and passes compare', async () => {
    const { fetchOneUser } = require('../../src/models/User');
    const { error } = require('../../src/utils/Logger');
    const { compare } = require('bcryptjs');
    const { signJWT } = require('../../src/utils/JWTUtil');

    const req = { query: { username: 'username', password: 'password' } };
    const res = { json: jest.fn() };

    await LoginController(req, res);

    expect(fetchOneUser).toHaveBeenCalledTimes(1);
    expect(fetchOneUser).toHaveBeenLastCalledWith(req.query.username);
    expect(error).not.toHaveBeenCalled();
    expect(compare).toHaveBeenCalledTimes(1);
    expect(compare).toHaveBeenLastCalledWith(req.query.password, 'password');
    expect(signJWT).toHaveBeenCalledTimes(1);
    expect(signJWT).toHaveBeenLastCalledWith({ password: 'password' });
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenLastCalledWith('JWT');
  });

  test('fetchOneUser with database error', async () => {
    const { fetchOneUser } = require('../../src/models/User');
    fetchOneUser.mockReturnValueOnce(Promise.reject());
    const { error } = require('../../src/utils/Logger');
    const { compare } = require('bcryptjs');

    const req = { query: { username: 'username', password: 'password' } };
    const res = { json: jest.fn() };

    await LoginController(req, res);

    expect(fetchOneUser).toHaveBeenCalledTimes(2);
    expect(fetchOneUser).toHaveBeenLastCalledWith(req.query.username);
    expect(error).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenLastCalledWith({ isFail: true });
  });

  test('fetchOneUser without database error and does not pass compare', async () => {
    const { fetchOneUser } = require('../../src/models/User');
    fetchOneUser.mockReturnValueOnce(Promise.resolve([{ password: 'password' }]));
    const { error } = require('../../src/utils/Logger');
    const { compare } = require('bcryptjs');
    compare.mockReturnValueOnce(Promise.resolve(false));

    const req = { query: { username: 'username', password: 'password' } };
    const res = { json: jest.fn() };

    await LoginController(req, res);

    expect(fetchOneUser).toHaveBeenCalledTimes(3);
    expect(fetchOneUser).toHaveBeenLastCalledWith(req.query.username);
    expect(error).toHaveBeenCalledTimes(1);
    expect(compare).toHaveBeenCalledTimes(2);
    expect(compare).toHaveBeenLastCalledWith(req.query.password, 'password');
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenLastCalledWith({ isFail: true });
  });

  test('fetchOneUser without database error and no result', async () => {
    const { fetchOneUser } = require('../../src/models/User');
    fetchOneUser.mockReturnValueOnce(Promise.resolve(null));
    const { error } = require('../../src/utils/Logger');
    const { compare } = require('bcryptjs');

    const req = { query: { username: 'username', password: 'password' } };
    const res = { json: jest.fn() };

    await LoginController(req, res);

    expect(fetchOneUser).toHaveBeenCalledTimes(4);
    expect(fetchOneUser).toHaveBeenLastCalledWith(req.query.username);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenLastCalledWith({ isFail: true });
  });
});
