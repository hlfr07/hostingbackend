import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsuariosService } from 'src/usuarios/usuarios.service';
export declare class RolesGuard implements CanActivate {
    private reflector;
    private readonly usuarioService;
    constructor(reflector: Reflector, usuarioService: UsuariosService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
