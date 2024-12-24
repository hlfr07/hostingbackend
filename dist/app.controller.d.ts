import { Response } from 'express';
import { AppService } from './app.service';
import { HttpService } from '@nestjs/axios';
export declare class AppController {
    private readonly appService;
    private readonly httpService;
    constructor(appService: AppService, httpService: HttpService);
    getHello(): string;
    getHello2(res: Response): Promise<void>;
}
