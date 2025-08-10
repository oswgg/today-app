import { existsSync, mkdirSync, rename, unlink } from 'fs';
import { extname } from 'path';
import { FileService } from 'src/domain/services/files.service';

export class PureFileService implements FileService {
    async move(originalPath: string, destination: string): Promise<string> {
        const extension = extname(originalPath);
        const fileName = originalPath.split('/').at(-1)!.split('.')[0];

        const dest = `${destination}/${fileName}${extension}`;

        if (!existsSync(destination)) {
            mkdirSync(destination, { recursive: true });
        }

        return await new Promise<string>((resolve, reject) => {
            rename(originalPath, dest, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(dest);
                }
            });
        });
    }

    async remove(file: string): Promise<void> {
        await new Promise<void>((resolve, reject) => {
            unlink(file, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    generateUniqueName(extension: string): string {
        // Implement a simple unique name generator
        return Date.now().toString() + '.' + extension;
    }
}
