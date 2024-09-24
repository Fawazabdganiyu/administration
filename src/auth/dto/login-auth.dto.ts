import { SignupAuthDto } from './signup-auth.dto';
import { OmitType } from '@nestjs/mapped-types';

export class LoginAuthDto extends OmitType(SignupAuthDto, ['role']) {}
