import { PickType } from '@nestjs/mapped-types';
import { SignupAuthDto } from './signupAuth.dto';

export class VerifyEmailDto extends PickType(SignupAuthDto, ['email']) {}
