import { TunelsService } from './tunels.service';
export declare class TunelsController {
    private readonly tunelsService;
    constructor(tunelsService: TunelsService);
    create(user: string): Promise<{
        tunnelId: any;
    }>;
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, userupadte: string): Promise<any>;
    remove(id: string): Promise<any>;
    config(id: string): Promise<any>;
    updateConfig(id: string, updateTunelDto: any): Promise<any>;
    dns(): Promise<any>;
    createDns(createdns: any): Promise<any>;
    updateDns(id: string, updateDns: any): Promise<any>;
    removeDns(id: string): Promise<any>;
    token(id: string): Promise<any>;
}
