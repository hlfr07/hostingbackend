import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UpdatePasswordUsuarioDto } from './dto/updatepassword-usuario.dto';
import { UpdatePasswordCodeUsuarioDto } from './dto/updatepasswordcode-usuarios.dto';
export declare class UsuariosController {
    private readonly usuariosService;
    constructor(usuariosService: UsuariosService);
    create(createUsuarioDto: CreateUsuarioDto): Promise<import("./entities/usuario.entity").Usuario>;
    findAll(): Promise<import("./entities/usuario.entity").Usuario[]>;
    findOne(id: string): Promise<import("./entities/usuario.entity").Usuario>;
    update(id: string, updateUsuarioDto: UpdateUsuarioDto): Promise<{
        message: string;
    }>;
    updatePassword(updatePasswordUsuarioDto: UpdatePasswordUsuarioDto): Promise<{
        message: string;
    }>;
    updatePasswordCode(dni: string, updatePasswordCodeUsuarioDto: UpdatePasswordCodeUsuarioDto): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
