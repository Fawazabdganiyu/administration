import { IsInt, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  companyName: string;

  @IsInt()
  numberOfUsers: number;

  @IsInt()
  numberOfProducts: number;
}
