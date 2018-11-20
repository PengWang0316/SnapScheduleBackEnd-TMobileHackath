import { verifyJWT, signJWT } from '../../src/utils/JWTUtil';

jest.mock('jsonwebtoken', () => ({ verify: jest.fn().mockReturnValue(true), sign: jest.fn().mockReturnValue('jwt') }));
jest.mock('dotenv', () => ({ config: jest.fn() }));

process.env.JWT_SECERT = 'secert';

describe('JWTUtil', () => {
  test('verifyJWT without error', () => {
    const jwt = require('jsonwebtoken');
    const mockRes = { status: jest.fn() };
    const message = 'message';
    expect(verifyJWT(message, mockRes)).toBe(true);
    expect(mockRes.status).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenLastCalledWith(200);
    expect(jwt.verify).toHaveBeenCalledTimes(1);
    expect(jwt.verify).toHaveBeenLastCalledWith(message, 'secert');
  });

  test('verifyJWT with jwt error', () => {
    const jwt = require('jsonwebtoken');
    jwt.verify.mockImplementation(() => { throw new Error(); });
    const mockRes = { status: jest.fn(), end: jest.fn() };
    const message = 'message';
    expect(() => verifyJWT(message, mockRes)).toThrow();
    expect(mockRes.status).toHaveBeenCalledTimes(2);
    expect(mockRes.status).toHaveBeenLastCalledWith(200);
    expect(mockRes.end).toHaveBeenCalledTimes(1);
    expect(jwt.verify).toHaveBeenCalledTimes(2);
    expect(jwt.verify).toHaveBeenLastCalledWith(message, 'secert');
  });

  test('signJWT', () => {
    const jwt = require('jsonwebtoken');
    const user = {
      id: 'id', password: 'password', other: 'other', username: 'username', photo: 'photo', name: 'name', vote_id: 'vote_id',
    };
    const returnUser = signJWT(user);
    expect(jwt.sign).toHaveBeenCalledTimes(1);
    expect(jwt.sign).toHaveBeenLastCalledWith({ id: 'id' }, 'secert');
    expect(returnUser.password).toBeUndefined();
    expect(returnUser).toEqual({
      id: 'id', jwt: 'jwt', username: 'username', name: 'name', photo: 'photo', vote_id: 'vote_id',
    });
  });
});
