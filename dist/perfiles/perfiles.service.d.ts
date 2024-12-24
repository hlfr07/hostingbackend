import { CreatePerfileDto } from './dto/create-perfile.dto';
import { UpdatePerfileDto } from './dto/update-perfile.dto';
import { Perfile } from './entities/perfile.entity';
import { Repository } from 'typeorm';
export declare class PerfilesService {
    private perfileRepository;
    constructor(perfileRepository: Repository<Perfile>);
    create(createPerfileDto: CreatePerfileDto): Promise<Perfile>;
    findAll(): Promise<Perfile[]>;
    findOne(id: number): Promise<Perfile>;
    update(id: number, updatePerfileDto: UpdatePerfileDto): Promise<{
        message: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
