import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { FileDestinations } from './files.config';

export class MulterConfigFactory {
    static get basic(): MulterOptions {
        return {
            storage: diskStorage({
                destination: FileDestinations.temporaryDirectory,
                filename: (req, file, cb) => {
                    cb(null, Date.now().toString() + '-' + file.originalname);
                },
            }),
        };
    }

    static get images(): MulterOptions {
        const options: MulterOptions = MulterConfigFactory.basic;
        options.fileFilter = (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return cb(
                    new BadRequestException('Only image files are allowed.'),
                    false,
                );
            }
            cb(null, true);
        };
        return options;
    }
}
