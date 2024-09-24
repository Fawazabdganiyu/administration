import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createUserDto: Prisma.UserCreateInput) {
    try {
      if (!Object.keys(createUserDto).length)
        return new BadRequestException('No data provided');

      // Only calculate the percentage if both the number of users and products are provided
      if (createUserDto.numberOfUsers && createUserDto.numberOfProducts) {
        createUserDto.percentage =
          (createUserDto.numberOfUsers / createUserDto.numberOfProducts) * 100;
      }

      // Get existing user
      const user = await this.databaseService.user.findUnique({
        where: { id: createUserDto.id },
      });
      if (user) {
        // Delete the user if it already exists
        await this.databaseService.user.delete({
          where: { id: createUserDto.id },
        });
      }

      return this.databaseService.user.create({ data: createUserDto });
    } catch (error) {
      return error;
    }
  }

  async findAll() {
    const users = await this.databaseService.user.findMany();
    if (!users.length) return new NotFoundException('No users found');

    return users;
  }

  async findMe(uid: string) {
    const user = await this.databaseService.user.findUnique({
      where: { id: uid },
    });

    if (!user) return new NotFoundException('User not found');

    return user;
  }
  async findOne(uid: string) {
    const user = await this.databaseService.user.findUnique({
      where: { id: uid },
    });

    if (!user) return new NotFoundException('User not found');

    return user;
  }

  async update(uid: string, updateUserDto: Prisma.UserUpdateInput) {
    const user = await this.databaseService.user.findUnique({
      where: { id: uid },
    });
    if (!user) return new NotFoundException('User not found');

    if (!Object.keys(updateUserDto).length) {
      return new BadRequestException('No data provided');
    }

    // Handle when the number of products is zero
    if (updateUserDto.numberOfProducts === 0) {
      updateUserDto.percentage = 0;
    }

    // Handle when the number of users is not provided
    let numberOfUsers = updateUserDto.numberOfUsers;
    if (numberOfUsers === undefined) {
      numberOfUsers = user?.numberOfUsers;
    }
    const numberOfProducts =
      updateUserDto.numberOfProducts || user?.numberOfProducts;

    // Calculate the percentage of users to products
    if (numberOfUsers && numberOfProducts) {
      updateUserDto.percentage =
        ((numberOfUsers as number) / (numberOfProducts as number)) * 100;
    }

    return this.databaseService.user.update({
      where: { id: uid },
      data: updateUserDto,
    });
  }

  async remove(uid: string) {
    const user = await this.databaseService.user.findUnique({
      where: { id: uid },
    });
    if (!user) return new NotFoundException('User not found');

    return this.databaseService.user.delete({
      where: { id: uid },
    });
  }
}
