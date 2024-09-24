import { PickType } from '@nestjs/mapped-types';
import { SignupAuthDto } from './signup-auth.dto';

export class VerifyEmailDto extends PickType(SignupAuthDto, ['email']) {}
