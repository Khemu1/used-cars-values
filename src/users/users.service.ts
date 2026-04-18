import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async createUser(data: { email: string; password: string }) {
    const foundUser = await this.findUsersByEmail(data.email);
    if (foundUser.length > 0) {
      throw new BadRequestException('Email already exists');
    }
    const user = this.repo.create({
      email: data.email,
      password: data.password,
    });
    return await this.repo.save(user);
  }

  async loginUser(data: { email: string; password: string }) {
    const user = await this.findUsersByEmail(data.email);
    if (user.length === 0) {
      throw new NotFoundException('User not found');
    }
    if (user[0].password !== data.password) {
      throw new NotFoundException('Invalid password');
    }
    return user[0];
  }

  async findUsersByEmail(email: string) {
    const user = await this.repo.findBy({ email });
    return user;
  }

  async isEmailTaken(email: string) {
    const [user] = await this.findUsersByEmail(email);
    return user;
  }

  async findUserById(id: number) {
    const user = await this.repo.findOne({
      where: { id },
      select: ['email', 'id'],
    });
    return user;
  }

  async removeUser(id: number) {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.repo.remove(user);
  }

  async updateUser(id: number, data: Partial<User>) {
    const foundUser = await this.findUserById(id);
    if (!foundUser) {
      throw new NotFoundException('User not found');
    }
    if (data.email) {
      const isEmailTaken = await this.isEmailTaken(data.email);
      console.log('isEmailTaken', isEmailTaken);
      if (isEmailTaken && isEmailTaken.id !== id) {
        throw new BadRequestException('Email already exists');
      }
    }
    Object.assign(foundUser, data);
    await this.repo.save(foundUser);
  }
}
