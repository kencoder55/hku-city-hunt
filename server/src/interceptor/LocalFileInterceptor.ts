import { diskStorage, memoryStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

const MAX_PROFILE_PICTURE_SIZE_IN_BYTES = 1024 * 1024 * 5;

export function createFileInterceptor(
  filePath: string,
  type: string,
  maxFileSize: number = MAX_PROFILE_PICTURE_SIZE_IN_BYTES,
  useMemory: boolean = false,
) {
  // default any file type
  let fileExtension = '.*';
  let allowedExtensions: string[] = [];

  switch (type) {
    case 'image':
      fileExtension = '(image/jpeg|image/png|image/gif|image/webp|image/svg|image/jpg|image/heic)';
      allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'heic'];
      break;
    case 'video':
      fileExtension = '(video/mp4|video/webm|video/ogg)';
      allowedExtensions = ['mp4', 'webm', 'ogg'];
      break;
    case 'audio':
      fileExtension = '(audio/mp3|audio/ogg|audio/wav)';
      allowedExtensions = ['mp3', 'ogg', 'wav'];
      break;
    case 'pdf':
      fileExtension = '(application/pdf)';
      allowedExtensions = ['pdf'];
      break;
    default:
      fileExtension = '.*';
      allowedExtensions = [];
  }

  return AnyFilesInterceptor({
    storage: useMemory
      ? memoryStorage()
      : diskStorage({
          destination: './uploads/' + filePath,
          filename: (req, file, cb) => {
            const ext = file.originalname.split('.').pop()?.toLowerCase() || '';

            // Validate file extension against whitelist
            if (allowedExtensions.length > 0 && !allowedExtensions.includes(ext)) {
              return cb(
                new BadRequestException(
                  `Invalid file extension. Allowed: ${allowedExtensions.join(', ')}`,
                ),
                '',
              );
            }

            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');

            return cb(null, `${randomName}.${ext}`);
          },
        }),
    limits: {
      fileSize: maxFileSize || MAX_PROFILE_PICTURE_SIZE_IN_BYTES,
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.match(fileExtension)) {
        return cb(null, true);
      }
      return cb(new BadRequestException('Only ' + type + ' files are allowed!'), false);
    },
  });
}
