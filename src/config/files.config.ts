export class FileDestinations {
    static get temporaryDirectory() {
        return './uploads/temp';
    }

    static get publicDirectory() {
        return './public';
    }

    static get privateVerificationDocuments() {
        return './uploads/private/verification-documents';
    }
}
