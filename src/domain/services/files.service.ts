export interface FileService {
    move(file: string, destination: string): Promise<string>;
    remove(file: string): Promise<void>;
    generateUniqueName(extension: string): string;
}

export const FILE_SERVICE_TOKEN = Symbol('file.service');
