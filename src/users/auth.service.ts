import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { promisify } from 'util';
import { scrypt as _scrypt, randomBytes } from 'crypto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async signup(data: { email: string; password: string }) {
    const foundUser = await this.usersService.findUsersByEmail(data.email);
    if (foundUser.length > 0) {
      throw new NotFoundException('Email already exists');
    }
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(data.password, salt, 32)) as Buffer;
    const res = salt + '.' + hash.toString('hex');
    return await this.usersService.createUser({
      ...data,
      password: res,
    });
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
