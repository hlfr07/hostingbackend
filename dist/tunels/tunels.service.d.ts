import { HttpService } from '@nestjs/axios';
export declare class TunelsService {
    private httpService;
    constructor(httpService: HttpService);
    create(user: string): Promise<{
        tunnelId: any;
    }>;
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateuser: string): Promise<any>;
    remove(id: string): Promise<any>;
    getConfig(id: string): Promise<any>;
    updateConfig(id: string, config: any): Promise<any>;
    getDns(): Promise<any>;
    createDns(createdns: any): Promise<any>;
    updateDns(id: string, updatedns: any): Promise<any>;
    deleteDns(id: string): Promise<any>;
    findDnsRecordByHostname(hostname: string): Promise<any>;
    getToken(id: string): Promise<{
        token: any;
    }>;
}
