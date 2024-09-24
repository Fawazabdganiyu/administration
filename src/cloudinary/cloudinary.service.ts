import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './interface/cloudinary-response.interface';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  upload(file: Express.Multer.File): Promise<CloudinaryResponse | any> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'nestjs-administration',
          public_id: file.originalname.split('.')[0],
          resource_type: 'image',
        },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        },
      );

      streamifier.createReadStream(file.buffer).pipe(stream);
    });
  }
}
