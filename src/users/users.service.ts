import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role, User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async createUser(data: { email: string; password: string }, role: Role) {
    const user = this.repo.create({
      email: data.email,
      password: data.password,
      role,
    });
    return await this.repo.save(user);
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
      select: ['email', 'id', 'role'],
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
