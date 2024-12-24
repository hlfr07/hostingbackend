import { PerfilesService } from './perfiles.service';
import { CreatePerfileDto } from './dto/create-perfile.dto';
import { UpdatePerfileDto } from './dto/update-perfile.dto';
export declare class PerfilesController {
    private readonly perfilesService;
    constructor(perfilesService: PerfilesService);
    create(createPerfileDto: CreatePerfileDto): Promise<import("./entities/perfile.entity").Perfile>;
    findAll(): Promise<import("./entities/perfile.entity").Perfile[]>;
    findOne(id: string): Promise<import("./entities/perfile.entity").Perfile>;
    update(id: string, updatePerfileDto: UpdatePerfileDto): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
