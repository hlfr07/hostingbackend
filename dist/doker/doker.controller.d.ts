import { DokerService } from './doker.service';
import { UpdatePasswordmysqlDto } from './dto/update-passwordmysql.dto';
import { ComandProjecthostDto } from './dto/comandprojecthost.dto';
export declare class DokerController {
    private readonly dokerService;
    constructor(dokerService: DokerService);
    createDoker(nombre: string): Promise<string>;
    startDoker(nombre: string): Promise<string>;
    updatePasswordmysql(updatePasswordmysqlDto: UpdatePasswordmysqlDto): Promise<string>;
    updateUserpsql(UpdatePasswordmysqlDto: UpdatePasswordmysqlDto): Promise<string>;
    stopDoker(nombre: string): Promise<string>;
    extractZip(zipName: string, containerName: string): Promise<string>;
    zipinstalldepencie(comandProjecthostDto: ComandProjecthostDto): Promise<{
        message: string;
    }>;
    start(comandProjecthostDto: ComandProjecthostDto): Promise<{
        message: string;
    }>;
    stopZip(containerName: string, port: number): Promise<{
        message: string;
    }>;
    deleteZip(carpeta: string, containerName: string): Promise<{
        message: string;
    }>;
    startCloudflare(containerName: string, token: string): Promise<{
        message: string;
    }>;
    stopCloudflare(containerName: string): Promise<{
        message: string;
    }>;
    updateHtpasswd(containerName: string, user: string, password: string): Promise<string>;
    startShellInABox(containerName: string): Promise<string>;
    stopShellInABox(containerName: string): Promise<string>;
    listFolder(containerName: string): Promise<string[]>;
}
