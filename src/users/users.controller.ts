import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Session,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptors';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { Role } from './user.entity';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/admin')
  async createAdmin(@Body() data: CreateUserDto, @Session() session: Record<string, any>) {
    console.log('createAdmin');
    const user = await this.authService.signup({ ...data, role: Role.Admin });
    session.userId = user.id;
    session.userRole = user.role;
    return user;
  }
  @Post('/signup')
  @HttpCode(201)
  async createUser(@Body() user: CreateUserDto, @Session() session: Record<string, any>) {
    const foundUser = await this.authService.signup(user);
    session.userId = foundUser.id;
    session.userRole = foundUser.role;
    return foundUser;
  }
  @Post('/login')
  @HttpCode(200)
  async login(@Body() user: CreateUserDto, @Session() session: Record<string, any>) {
    const foundUser = await this.authService.login(user);
    session.userId = foundUser.id;
    session.userRole = foundUser.role;
    return foundUser;
  }

  @HttpCode(204)
  @Delete('/signout')
  signout(@Session() session: Record<string, any>) {
    session.userId = null;
    session.userRole = null;
  }

  @Get('/:id')
  async findUserById(@Param() data: { id: string }) {
    const { id } = data;
    const user = await this.userService.findUserById(+id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  @Patch('/:id')
  async updateUser(@Param() data: { id: string }, @Body() user: UpdateUserDto) {
    const { id } = data;
    return await this.userService.updateUser(+id, user);
  }

  @Delete('/:id/remove')
  @HttpCode(204)
  async removeUser(@Param() data: { id: string }) {
    const { id } = data;

    await this.userService.removeUser(+id);
  }
}
