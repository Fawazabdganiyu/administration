import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FirebaseAdmin } from '../../config/firebase.setup';

@Module({
  controllers: [AuthController],
  providers: [AuthService, FirebaseAdmin],
})
export class AuthModule {}
