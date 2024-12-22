import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: '294396771689233',
  api_secret: '78x12WbMrHYuUt-eZ1QzMmiAFaM',
});
@Injectable()
export class ClounidaryService {
  async uploadImage(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadApiResponse> {
    try {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: folder }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          })
          .end(file.buffer);
      });
    } catch (error) {
      const typedError = error as any; // Replace SomeErrorType with your specific type
      console.error(typedError.message);
    }
  }
}
