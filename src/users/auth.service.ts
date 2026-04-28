import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { promisify } from 'util';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { Role } from './user.entity';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async signup({ email, password, role = Role.User }: { email: string; password: string; role?: Role }) {
    const foundUser = await this.usersService.findUsersByEmail(email);
    if (foundUser.length > 0) {
      throw new BadRequestException('Email already exists');
    }
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const res = salt + '.' + hash.toString('hex');
    return await this.usersService.createUser(
      {
        email,
        password: res,
      },
      role,
    );
  }
  async login(data: { email: string; password: string }) {
    const [user] = await this.usersService.findUsersByEmail(data.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(data.password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new UnauthorizedException('Invalid password');
    }
    return user;
  }
}
