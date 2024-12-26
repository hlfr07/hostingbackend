import { DokerService } from './doker.service';
import { UpdatePasswordmysqlDto } from './dto/update-passwordmysql.dto';
export declare class DokerController {
    private readonly dokerService;
    constructor(dokerService: DokerService);
    createDoker(nombre: string): Promise<string>;
    startDoker(nombre: string): Promise<string>;
    updatePasswordmysql(updatePasswordmysqlDto: UpdatePasswordmysqlDto): Promise<string>;
    updateUserpsql(UpdatePasswordmysqlDto: UpdatePasswordmysqlDto): Promise<string>;
    stopDoker(nombre: string): Promise<string>;
    extractZip(zipName: string, containerName: string): Promise<string>;
    zipinstalldepencie(carpeta: string, containerName: string): Promise<string>;
    start(carpeta: string, containerName: string, comand: string): Promise<string>;
    stopZip(containerName: string, port: number): Promise<string>;
    deleteZip(carpeta: string, containerName: string): Promise<string>;
    startCloudflare(containerName: string, token: string): Promise<string>;
    stopCloudflare(containerName: string): Promise<string>;
    updateHtpasswd(containerName: string, user: string, password: string): Promise<string>;
    startShellInABox(containerName: string): Promise<string>;
    stopShellInABox(containerName: string): Promise<string>;
    listFolder(containerName: string): Promise<string[]>;
}
