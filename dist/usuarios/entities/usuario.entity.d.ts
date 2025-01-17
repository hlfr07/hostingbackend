import { Perfile } from "src/perfiles/entities/perfile.entity";
export declare class Usuario {
    id: number;
    nombre: string;
    email: string;
    usuario: string;
    password: string;
    perfil: Perfile;
    id_tunel: string;
    estado: boolean;
    resetCode: string;
    resetCodeExpiration: Date;
    etapa: number;
    id_proyecto: string;
}
