import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './user.entity';

let service: AuthService;
let fakeUsersService: Partial<UsersService>;
describe('AuthService tests', () => {
  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      createUser: (data: { email: string; password: string }) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email: data.email,
          password: data.password,
        };
        users.push(user);
        return Promise.resolve(user);
      },
      findUsersByEmail: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });
  it('can create an instace of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('can signup user', async () => {
    const user = await service.signup({
      email: 'test@test.com',
      password: 'test',
    });

    expect(user.password).not.toEqual('test');
    const [salt, hash] = user.password.split('.');
    expect(hash).toBeDefined();
    expect(salt).toBeDefined();
  });

  it('throws if email already exists', async () => {
    await service.signup({ email: 'test@test.com', password: 'test' });

    await expect(
      service.signup({ email: 'test@test.com', password: 'test' }),
    ).rejects.toThrow(BadRequestException);
  });

  it("throw if sign in return user's password doesn't match", async () => {
    await service.signup({ email: 'test@test.com', password: 'test' });

    await expect(
      service.login({ email: 'test@test.com', password: 'wrong' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('can login user wihh provided password', async () => {
    await service.signup({
      email: 'test@test.com',
      password: 'test',
    });
    const user = await service.login({
      email: 'test@test.com',
      password: 'test',
    });
    expect(user).toBeDefined();
  });
});
