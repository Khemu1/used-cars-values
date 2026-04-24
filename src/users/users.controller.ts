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
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import {
  Serialize,
  SerializeInterceptor,
} from '../interceptors/serialize.interceptors';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Serialize(UserDto)
  @Post('/signup')
  @HttpCode(201)
  async createUser(@Body() user: CreateUserDto, @Session() session: any) {
    const foundUser = await this.authService.signup(user);
    session.userId = foundUser.id;
    return foundUser;
  }
  @Serialize(UserDto)
  @Post('/login')
  async login(@Body() user: CreateUserDto, @Session() session: any) {
    const foundUser = await this.authService.login(user);
    session.userId = foundUser.id;
    return foundUser;
  }

  @HttpCode(204)
  async signout(@Session() session: any) {
    session.userId = null;
  }

  @Serialize(UserDto)
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
