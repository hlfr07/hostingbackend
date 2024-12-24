import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'zip_projects'})
export class ZipProject {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    zip: string;

    //usando manytone para relacionar con la tabla con usuarios
    @ManyToOne(() => Usuario, user => user.id, {eager: true})
    @JoinColumn({name: 'usuario_id'})
    usuario: Usuario;

    @Column({default: true})
    estado: boolean;
}
