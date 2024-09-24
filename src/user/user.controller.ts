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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
import { Prisma, Role } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

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
  @Auth('ADMIN', 'USER')
  findMe(@Req() req: Request) {
    const { uid } = req.user;
    return this.userService.findMe(uid);
  }

  @Auth('ADMIN')
  @Get(':uid')
  findOne(@Param('uid') uid: string) {
    return this.userService.findOne(uid);
  }

  @Auth('USER')
  @Patch(':uid')
  update(@Param('uid') uid: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(uid, updateUserDto);
  }

  @Auth('ADMIN', 'USER')
  @Delete(':uid')
  remove(@Param('uid', ParseIntPipe) uid: string) {
    return this.userService.remove(uid);
  }

  @Auth('ADMIN')
  @Put('image-upload/:uid')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @Param('uid') uid: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const result = await this.cloudinaryService.upload(image);
    console.log(result);
    return this.userService.update(uid, { image: result.secure_url });
  }
}
