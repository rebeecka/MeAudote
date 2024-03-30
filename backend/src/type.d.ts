import * as http from 'http';
import { payloadToken } from '@src/Application/services/auth.service';

declare module 'express-serve-static-core' {
    export interface Request extends http.IncomingMessage, Express.Request {
        decoded?: payloadToken;
    }
}