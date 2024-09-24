import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { FirebaseAdmin } from '../../config/firebase.setup';
import { LoginAuthDto, SignupAuthDto, VerifyEmailDto } from './dto';

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

  async login(loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;

    // Firebase REST API URL for email/password sign-in
    // This is done here because there is no frontend to handle the sign-in
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`;

    try {
      // Make a POST request to the Firebase REST API
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
          //expiresIn: 60 * 60 * 2, // 2 hours
          expiresIn: 60 * 30, // 30 minutes
        }),
      });

      // Parse the response
      const data = await response.json();
      if (data.error) {
        throw new BadRequestException(data.error.message);
      }

      const { idToken, expiresIn, localId } = data;

      return {
        message: 'Login successful',
        data: {
          idToken,
          expiresIn: `${expiresIn / 60} minutes`,
          localId,
        },
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
