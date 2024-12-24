import { CreateAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from 'src/usuarios/usuarios.service';
export declare class AuthService {
    private readonly usuarioService;
    private readonly jwtService;
    constructor(usuarioService: UsuariosService, jwtService: JwtService);
    create(createAuthDto: CreateAuthDto): Promise<{
        token: string;
        refreshToken: string;
    }>;
}
