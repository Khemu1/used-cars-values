import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findUserById: (id: number) =>
        Promise.resolve({ id, email: 'test@test.com', password: 'test' }),
    };
    fakeAuthService = {
      signup: (user: Partial<User>) =>
        Promise.resolve({ id: 24, email: user.email } as User),
      login: (data: { email: 'test@gmail.com'; password: 'testpassword' }) =>
        Promise.resolve({ id: 24, email: data.email } as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('get user by id  ', async () => {
    const user = await controller.findUserById({ id: '24' });
    expect(user).toBeDefined();
    expect(user.id).toEqual(24);
  });

  it("didn't find user by id", async () => {
    fakeUsersService.findUserById = (id: number) => Promise.resolve(null);
    await expect(controller.findUserById({ id: '24' })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should signin user', async () => {
    const session: { userId?: number } = {};

    const user = await controller.login(
      { email: 'test@test.com', password: 'test' },
      session,
    );
    expect(user).toBeDefined();
    expect(user.email).toEqual('test@test.com');
    expect(session?.userId).toEqual(24);
  });

  it('should signup user', async () => {
    const session: { userId?: number } = {};
    const user = await controller.createUser(
      { email: 'test@test.com', password: 'test' },
      session,
    );
    expect(user).toBeDefined();
    expect(session?.userId).toEqual(24);
  });

  it('should signout user', async () => {
    const session: { userId?: number } = { userId: 24 };
    await controller.signout(session);
    expect(session?.userId).toBeNull();
  });
});
