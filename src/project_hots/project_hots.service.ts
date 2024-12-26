import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProjectHotDto } from './dto/create-project_hot.dto';
import { UpdateProjectHotDto } from './dto/update-project_hot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectHot } from './entities/project_hot.entity';
import { privateDecrypt } from 'crypto';
import { Repository } from 'typeorm';
import { ZipProject } from 'src/zip_projects/entities/zip_project.entity';
import { ReplOptions } from 'repl';
import { DokerService } from 'src/doker/doker.service';
import { TunelsService } from 'src/tunels/tunels.service';

@Injectable()
export class ProjectHotsService {
  constructor(@InjectRepository(ProjectHot) private projecthotRepository: Repository<ProjectHot>, @InjectRepository(ZipProject) private zipprojectRepository: Repository<ZipProject>, private readonly dokerService: DokerService, private readonly serviceTunnel: TunelsService) { }
  async create(createProjectHotDto: CreateProjectHotDto) {
    //verificaremos que el id de zip_project exista
    const projecthotExist = await this.zipprojectRepository.findOneBy({
      id: parseInt(createProjectHotDto.zip_id)
    });

    if (!projecthotExist) {
      throw new HttpException('El id de zip_project no existe', HttpStatus.NOT_FOUND);
    }

    //verifica que el puerto sea puro numero
    if (isNaN(parseInt(createProjectHotDto.port))) {
      throw new HttpException('El port debe ser un número', HttpStatus.BAD_REQUEST);
    }

    // Validar que la URL cumpla con el formato específico del usuario
    const urlPattern = new RegExp(`^.+_${projecthotExist.usuario.usuario}\\.theinnovatesoft\\.xyz$`);
    if (!urlPattern.test(createProjectHotDto.url)) {
      throw new HttpException(
        `La URL debe contener el formato "{loqueguste}_${projecthotExist.usuario.usuario}.theinnovatesoft.xyz"`,
        HttpStatus.BAD_REQUEST,
      );
    }

    //Ahora llamaremmos al servicio de doker para obtener el nombre de la carpeta
    const extraerzip = await this.dokerService.extraerzip(projecthotExist.zip, projecthotExist.usuario.usuario);

    console.log(extraerzip);

    //Ahora vamos a crear la nueva configuracion para ello llamaremos al servicio de tunel
    const tunel = await this.serviceTunnel.getConfig(projecthotExist.usuario.id_tunel);
    // Crear la nueva entrada
    const newIngress = {
      service: `http://localhost:${createProjectHotDto.port}`,
      hostname: createProjectHotDto.url,
      originRequest: {},
    };

    // Encontrar la posición del objeto con "service": "http_status:404"
    const ingress = tunel.config.ingress;
    const index404 = ingress.findIndex((item) => item.service === "http_status:404");

    // Insertar antes del objeto con "service": "http_status:404"
    if (index404 !== -1) {
      ingress.splice(index404, 0, newIngress); // Insertar antes del índice encontrado
    } else {
      // Si no existe, agregar al final como respaldo
      ingress.push(newIngress);
    }

    // Actualizar la configuración del túnel (si es necesario)
    tunel.config.ingress = ingress;
    const tunelConfig = {
      config: tunel.config,
    };

    // Actualizar la configuración del túnel
    await this.serviceTunnel.updateConfig(projecthotExist.usuario.id_tunel, tunelConfig);

    //crearemos un nuevo projectHot
    const newProjectHot = this.projecthotRepository.create({
      zipProject: projecthotExist,
      namecarpeta: extraerzip,
      url: createProjectHotDto.url,
      port: parseInt(createProjectHotDto.port)
    });

    //guardamos el projectHot
    await this.projecthotRepository.save(newProjectHot);

    return newProjectHot;
  }

  findAll() {
    const project_hots = this.projecthotRepository.find({
      order: { id: 'DESC' }
    });

    return project_hots;
  }

  async findOne(id: number) {
    const projectHotExist = await this.projecthotRepository.findOneBy({
      id: id
    });

    if (!projectHotExist) {
      throw new HttpException('ProjectHot no encontrado', HttpStatus.NOT_FOUND);
    }

    return projectHotExist;
  }

  async update(id: number, updateProjectHotDto: UpdateProjectHotDto) {
    return `This action updates a #${id} projectHot`;
  }

  async remove(id: number) {
    const projectHotExist = await this.projecthotRepository.findOneBy({
      id: id
    });

    if (!projectHotExist) {
      throw new HttpException('ProjectHot no encontrado', HttpStatus.NOT_FOUND);
    }

    if (!projectHotExist.estado) {
      throw new HttpException('ProjectHot no encontrado', HttpStatus.NOT_FOUND);
    }

    await this.projecthotRepository.update(id, { estado: false });

    return { message: 'ProjectHot eliminado correctamente' };
  }
}
