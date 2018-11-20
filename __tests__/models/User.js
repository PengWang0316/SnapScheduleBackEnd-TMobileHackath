import User from '../../src/models/User';

jest.mock('../../src/DBHelper', () => ({
  getPool: jest.fn().mockReturnValue({
    query: jest.fn().mockImplementation((sql, paramters, cb) => cb(null, [{ id: 1 }], null)),
  }),
}));

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));

const VOTE_SQL = 'UPDATE users SET vote_id = ? where id = ? and vote_id IS NULL';


describe('User Model', () => {
  test('fetchOneUser without error', async () => {
    const { error } = require('../../src/utils/Logger');
    const { getPool } = require('../../src/DBHelper');

    const result = await User.fetchOneUser('username');

    expect(getPool).toHaveBeenCalledTimes(1);
    expect(error).not.toHaveBeenCalled();
    expect(result).toEqual([{ id: 1 }]);
  });

  test('fetchOneUser with an error', async () => {
    const { error } = require('../../src/utils/Logger');
    const { getPool } = require('../../src/DBHelper');
    getPool.mockReturnValueOnce({
      query: jest.fn().mockImplementation((sql, paramters, cb) => cb({}, [{ id: 1 }], null)),
    });

    try {
      await User.fetchOneUser('username');
    } catch (err) {
      expect(getPool).toHaveBeenCalledTimes(2);
      expect(error).toHaveBeenCalledTimes(1);
    }
  });

  test('registerNewUser without error', async () => {
    const { error } = require('../../src/utils/Logger');
    const { getPool } = require('../../src/DBHelper');

    const user = {
      username: 'username',
      password: 'password',
      name: 'name',
      photo: 'photo',
    };
    const result = await User.registerNewUser(user);

    expect(getPool).toHaveBeenCalledTimes(3);
    expect(error).toHaveBeenCalledTimes(1);
    expect(result).toEqual([{ id: 1 }]);
  });

  test('registerNewUser with database error', async () => {
    const { error } = require('../../src/utils/Logger');
    const { getPool } = require('../../src/DBHelper');
    getPool.mockReturnValueOnce({
      query: jest.fn().mockImplementation((sql, paramters, cb) => cb({}, [{ id: 1 }], null)),
    });

    const user = {
      username: 'username',
      password: 'password',
      name: 'name',
      photo: 'photo',
    };

    try {
      await User.registerNewUser(user);
    } catch (err) {
      expect(getPool).toHaveBeenCalledTimes(4);
      expect(error).toHaveBeenCalledTimes(2);
    }
  });
});
