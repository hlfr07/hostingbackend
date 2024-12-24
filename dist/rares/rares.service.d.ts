import { HttpException } from '@nestjs/common';
import { CreateRareDto } from './dto/create-rare.dto';
import { UpdateRareDto } from './dto/update-rare.dto';
import { ZipProject } from 'src/zip_projects/entities/zip_project.entity';
import { Repository } from 'typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { TunelsService } from 'src/tunels/tunels.service';
export declare class RaresService {
    private zipProjectRepository;
    private usuarioRepository;
    private readonly tunelsService;
    constructor(zipProjectRepository: Repository<ZipProject>, usuarioRepository: Repository<Usuario>, tunelsService: TunelsService);
    create(createRareDto: CreateRareDto, rarname: string): Promise<HttpException | ZipProject>;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateRareDto: UpdateRareDto): string;
    remove(id: number): string;
}
