import express, { Application } from 'express';
import path from 'path';
import 'dotenv/config';
import '../../utils/module-alias';
import * as database from '@src/Infra/database';
import routes from '@src/Infra/http/routes';

class Server {
    private app: Application;

    constructor() {
        this.app = express();
    }

    public async setup(): Promise<void> {
        this.app.use(express.json({ limit: '100mb' }));
        this.app.use(routes);
        this.app.use('/files', express.static(path.resolve(process.cwd(), '..', 'storage-tmp')));
        await database.connect();
    }

    public start(): void {
        this.app.listen(process.env.PORT, () => {
            console.info('Server listening on port: ', process.env.PORT);
        });
    }

    public async close(): Promise<void> {
        await database.close();
    }

    public getApp(): Application {
        return this.app;
    }
}

export { Server };