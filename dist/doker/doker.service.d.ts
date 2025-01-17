import { UpdatePasswordmysqlDto } from './dto/update-passwordmysql.dto';
import { UpdatePasswordpsqlDto } from './dto/update-passwordpsql.dto';
import { ComandProjecthostDto } from './dto/comandprojecthost.dto';
export declare class DokerService {
    private docker;
    constructor();
    createContainer(username: string): Promise<string>;
    startDocker(nombre: string): Promise<string>;
    private streamToString;
    updatePasswordmysql(UpdatePasswordmysqlDto: UpdatePasswordmysqlDto): Promise<string>;
    updatePasswordpsql(UpdatePasswordpsqlDto: UpdatePasswordpsqlDto): Promise<string>;
    stopDocker(nombre: string): Promise<string>;
    extraerzip(zipName: string, containerName: string): Promise<string>;
    zipinstalldepencie(comandProjecthostDto: ComandProjecthostDto): Promise<{
        message: string;
    }>;
    zipstart(comandProjecthostDto: ComandProjecthostDto): Promise<{
        message: string;
    }>;
    stopZip(containerName: string, port: number): Promise<{
        message: string;
    }>;
    deleteFolder(carpeta: string, containerName: string): Promise<{
        message: string;
    }>;
    startserviceCloudflare(containerName: string, token: string): Promise<{
        message: string;
    }>;
    stopServiceCloudflare(containerName: string): Promise<{
        message: string;
    }>;
    updateHtpasswd(containerName: string, user: string, password: string): Promise<string>;
    startShellInABox(containerName: string): Promise<string>;
    stopShellInABox(containerName: string): Promise<string>;
    listFolder(containerName: string): Promise<string[]>;
    private streamToBuffer;
}
