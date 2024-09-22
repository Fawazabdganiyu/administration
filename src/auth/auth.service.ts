import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { FirebaseAdmin } from 'config/firebase.setup';
import { SignupAuthDto, VerifyEmailDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private readonly admin: FirebaseAdmin) {}

  async signup(authDto: SignupAuthDto) {
    const { email, password, role } = authDto;
    const app = this.admin.setup();

    try {
      const user = await app?.auth().createUser({
        email,
        password,
      });

      await app?.auth().setCustomUserClaims(user?.uid as string, { role });

      return {
        message: 'User created successfully',
        data: {
          uid: user?.uid,
          role: user?.customClaims?.role,
        },
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async verifyEmail(authDto: VerifyEmailDto) {
    const { email } = authDto;
    const app = this.admin.setup();

    try {
      const user = await app?.auth().getUserByEmail(email);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (user.emailVerified)
        throw new BadRequestException('Email already verified');

      await app?.auth().updateUser(user.uid, { emailVerified: true });

      return {
        message: 'Email verified successfully',
        data: {
          uid: user.uid,
          role: user.customClaims?.role,
        },
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
