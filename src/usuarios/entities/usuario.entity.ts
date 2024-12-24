import { Perfile } from "src/perfiles/entities/perfile.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "usuarios" })
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ nullable: false })
    nombre: string;
    @Column({ unique: true, nullable: false })
    email: string;
    @Column({ unique: true, nullable: false })
    usuario: string;
    @Column({ nullable: false })
    password: string;
    //aca ponemos el fk id_perfil
    @ManyToOne(() => Perfile, perfil => perfil.id, { eager: true })
    @JoinColumn({ name: 'id_perfil' })
    perfil: Perfile;
    @Column({ nullable: true })
    id_tunel: string;
    @Column({ default: true })
    estado: boolean;
    @Column({ nullable: true })
    resetCode: string;
    @Column({ type: 'timestamp', nullable: true })
    resetCodeExpiration: Date;
}
