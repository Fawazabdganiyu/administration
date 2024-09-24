import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/database/database.module';
import { FirebaseAdmin } from 'config/firebase.setup';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [DatabaseModule, CloudinaryModule],
  controllers: [UserController],
  providers: [UserService, FirebaseAdmin, CloudinaryService],
})
export class UserModule {}
