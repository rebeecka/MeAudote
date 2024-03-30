import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export class Base64ToImageService {
    static base64ToImage(base64: string) {
        const fileName: string = `${uuidv4()}.png`;
        const path: string = `../storage-tmp/${fileName}`
        const buffer = Buffer.from(base64, 'base64');
        fs.writeFileSync(path, buffer);
        return fileName;
    }
}