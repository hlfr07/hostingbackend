import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRareDto } from './dto/create-rare.dto';
import { UpdateRareDto } from './dto/update-rare.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ZipProject } from 'src/zip_projects/entities/zip_project.entity';
import { Repository } from 'typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { TunelsService } from 'src/tunels/tunels.service';

@Injectable()
export class RaresService {
  constructor(@InjectRepository(ZipProject) private zipProjectRepository: Repository<ZipProject>, @InjectRepository(Usuario) private usuarioRepository: Repository<Usuario>, private readonly tunelsService: TunelsService ) { }
  async create(createRareDto: CreateRareDto, rarname: string) {

    //ahora vamos a verificar si el usuario existe
    const user = await this.usuarioRepository.findOneBy({
      usuario: createRareDto.usuario
    });

    if (!user) {
      return new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    //ahora vamos a crear el proyecto
    const nuevoProyecto = await this.zipProjectRepository.create({
      zip: rarname,
      usuario: user
    });

    await this.zipProjectRepository.save(nuevoProyecto);

    return nuevoProyecto;
  }

  findAll() {
    return `This action returns all rares`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rare`;
  }

  update(id: number, updateRareDto: UpdateRareDto) {
    return `This action updates a #${id} rare`;
  }

  remove(id: number) {
    return `This action removes a #${id} rare`;
  }
}
