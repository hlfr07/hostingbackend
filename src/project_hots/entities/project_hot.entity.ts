import { ZipProject } from "src/zip_projects/entities/zip_project.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "project_hots" })
export class ProjectHot {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ZipProject, (zipProject) => zipProject.id, { eager: true })
    @JoinColumn({ name: "zip_id" })
    zipProject: ZipProject;

    @Column({ type: 'text' })
    namecarpeta: string;

    @Column()
    url: string;

    @Column()
    port: number;

    @Column({ default: false })
    webstatus: boolean;

    @Column({ default: true })
    estado: boolean;
}
