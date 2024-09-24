import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
import { Prisma, Role } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put()
  @Auth('USER')
  async create(@Req() req: Request) {
    // Obtain the uid and role from the request object as set by the AuthGuard
    const { uid, role } = req.user;

    // Validate the request body
    const createUserDto = plainToClass(CreateUserDto, req.body);
    const errors = await validate(createUserDto);
    if (errors.length) {
      return { errors: errors.map((error) => error.constraints) };
    }

    // Create a new user with the calculated percentage
    const data: Prisma.UserCreateInput = {
      id: uid,
      role: role as Role,
      ...createUserDto,
    };
    return this.userService.create(data);
  }

  @Get()
  @Auth('ADMIN')
  findAll() {
    return this.userService.findAll();
  }

  @Get('me')
  findMe(@Req() req: Request) {
    const { uid } = req.user;
    return this.userService.findOne(uid);
  }

  @Auth('ADMIN')
  @Get(':uid')
  findOne(@Param('uid') uid: string) {
    return this.userService.findOne(uid);
  }

  @Auth('ADMIN', 'USER')
  @Patch(':uid')
  update(@Param('uid') uid: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(uid, updateUserDto);
  }

  @Auth('ADMIN', 'USER')
  @Delete(':uid')
  remove(@Param('uid', ParseIntPipe) uid: string) {
    return this.userService.remove(uid);
  }
}
