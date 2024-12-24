import { CreateComandDto } from './dto/create-comand.dto';
import { UpdateComandDto } from './dto/update-comand.dto';
export declare class ComandsService {
    create(createComandDto: CreateComandDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateComandDto: UpdateComandDto): string;
    remove(id: number): string;
    installDependencies(usuario: string, namefile: string): Promise<string>;
    stop(user: string): Promise<unknown>;
    getPortsOcupados(min: number, max: number): Promise<number[]>;
    private extraerPuertos;
    start(usuario: string, projectDirName: string, command: string): Promise<string>;
    terminate(port: number): Promise<string>;
}
