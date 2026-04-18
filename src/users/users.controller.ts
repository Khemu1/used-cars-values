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
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { Serialize, SerializeInterceptor } from '../interceptors/serialize.interceptors';
import { UserDto } from './dtos/user.dto';

@Controller('auth')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Serialize(UserDto)
  @Post('/signup')
  @HttpCode(201)
  async createUser(@Body() user: CreateUserDto) {
    return await this.userService.createUser(user);
  }
  @Serialize(UserDto)
  @Post('/login')
  async login(@Body() user: CreateUserDto) {
    return await this.userService.loginUser(user);
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
