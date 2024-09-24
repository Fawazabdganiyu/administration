import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FirebaseAdmin } from '../../../config/firebase.setup';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly admin: FirebaseAdmin,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const app = this.admin.setup();
    const idToken = context.getArgs()[0]?.headers?.authorization?.split(' ')[1];
    if (!idToken) {
      throw new UnauthorizedException('No token provided');
    }

    const permissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    try {
      const claims = await app?.auth().verifyIdToken(idToken);

      // Attach the user claims to the request object
      context.switchToHttp().getRequest().user = claims;

      if (permissions.includes(claims?.role)) return true;

      throw new UnauthorizedException();
    } catch (error) {
      console.error('Error', error);
      throw new UnauthorizedException(error.message);
    }
  }
}
