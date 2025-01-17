import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { UpdatePasswordUsuarioDto } from './dto/updatepassword-usuario.dto';
import { MailService } from '../mail/mail.service';
import { UpdatePasswordCodeUsuarioDto } from './dto/updatepasswordcode-usuarios.dto';
import { Perfile } from 'src/perfiles/entities/perfile.entity';
import { TunelsService } from 'src/tunels/tunels.service';
import { DokerService } from 'src/doker/doker.service';
export declare class UsuariosService {
    private usuarioRepository;
    private readonly mailService;
    private perfileRepository;
    private readonly tunelsService;
    private readonly dokerService;
    constructor(usuarioRepository: Repository<Usuario>, mailService: MailService, perfileRepository: Repository<Perfile>, tunelsService: TunelsService, dokerService: DokerService);
    create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario>;
    findAll(): Promise<Usuario[]>;
    findOne(id: number): Promise<Usuario>;
    update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<{
        message: string;
    }>;
    updatePassword(UpdatePasswordUsuarioDto: UpdatePasswordUsuarioDto): Promise<{
        message: string;
    }>;
    updatePasswordCode(UpdatePasswordCodeUsuarioDto: UpdatePasswordCodeUsuarioDto): Promise<{
        message: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
    buscarParaLogin(usuario: string): Promise<Usuario>;
    updateEtapa(id: number, etapa: number, id_proyecto: number): Promise<{
        message: string;
    }>;
}
