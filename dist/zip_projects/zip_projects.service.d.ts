import { CreateZipProjectDto } from './dto/create-zip_project.dto';
import { UpdateZipProjectDto } from './dto/update-zip_project.dto';
export declare class ZipProjectsService {
    private docker;
    constructor();
    create(createZipProjectDto: CreateZipProjectDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateZipProjectDto: UpdateZipProjectDto): string;
    remove(id: number): string;
    zipProjecTDocker(nombre: string, containerName: string): Promise<string>;
}
