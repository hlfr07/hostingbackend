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
import axios from 'axios';

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

  //ahora un metodo get por id_usuario
  // async findOneByUser(id: number) {
  //   const projectHotExist = await this.projecthotRepository.find({
  //     where: {
  //       zipProject: {
  //         usuario: {
  //           id: id,
  //         },
  //       },
  //     },
  //   });

  //   if (!projectHotExist || projectHotExist.length === 0) {
  //     throw new HttpException('ProjectHot no encontrado', HttpStatus.NOT_FOUND);
  //   }

  //   // Iterar y verificar cada URL
  //   for (const project of projectHotExist) {
  //     const url = project.url;
  //     const urlCompleta = `https://${url}`;

  //     try {
  //       const response = await axios.get(urlCompleta, { timeout: 5000 }); // Timeout opcional
  //       // console.log(response);
  //       if (response.status >= 200 && response.status < 400) {
  //         project.webstatus = true; // URL accesible
  //       } else {
  //         project.webstatus = false; // webstatus no esperado
  //       }
  //     } catch (error) {
  //       project.webstatus = false; // Error en la solicitud
  //     }
  //   }

  //   return projectHotExist;
  // }
  async findOneByUser(id: number, page: number, limit: number) {
    // Calcular cuántos registros saltar basándonos en el número de página y el límite
    const skip = (page - 1) * limit;
  
    // Consultar la base de datos con paginación
    const [projectHotExist, totalCount] = await this.projecthotRepository.findAndCount({
      where: {
        zipProject: {
          usuario: {
            id: id,
          },
        },
        estado: true,
      },
      take: limit, // Cantidad de registros por página
      skip: skip,  // Saltar registros según la página
    });
  
    if (!projectHotExist || projectHotExist.length === 0) {
      throw new HttpException('ProjectHot no encontrado', HttpStatus.NOT_FOUND);
    }
  
    // Iterar y verificar cada URL
    for (const project of projectHotExist) {
      const url = project.url;
      const urlCompleta = `https://${url}`;
  
      try {
        const response = await axios.get(urlCompleta, { timeout: 5000 }); // Timeout opcional
        if (response.status >= 200 && response.status < 400) {
          project.webstatus = true; // URL accesible
        } else {
          project.webstatus = false; // webstatus no esperado
        }
      } catch (error) {
        project.webstatus = false; // Error en la solicitud
      }
    }
  
    // Retornar los registros junto con información de la paginación
    return {
      data: projectHotExist,
      total: totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    };
  }
  

  //ahora los mimso que el anterior pero por id de zip_project
  async findOneByZipProject(id: number) {
    console.log("entro");
    const projectHotExist = await this.projecthotRepository.find({
      where: {
        zipProject: {
          id: id,
        },
      },
    });

    if (!projectHotExist || projectHotExist.length === 0) {
      throw new HttpException('ProjectHot no encontrado', HttpStatus.NOT_FOUND);
    }

    // Iterar y verificar cada URL
    for (const project of projectHotExist) {
      const url = project.url;
      const urlCompleta = `https://${url}`;

      try {
        const response = await axios.get(urlCompleta, { timeout: 5000 }); // Timeout opcional
        // console.log(response);
        if (response.status >= 200 && response.status < 400) {
          project.webstatus = true; // URL accesible
        } else {
          project.webstatus = false; // webstatus no esperado
        }
      } catch (error) {
        project.webstatus = false; // Error en la solicitud
      }
    }

    console.log("ua esta");
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

    //llamamos al servicio de doker para eliminar la carpeta
    await this.dokerService.deleteFolder(projectHotExist.namecarpeta, projectHotExist.zipProject.usuario.usuario);

    //llamamos al servicio de tunel para eliminar la configuracion
    const tunel = await this.serviceTunnel.getConfig(projectHotExist.zipProject.usuario.id_tunel);
    const ingress = tunel.config.ingress;
    const index = ingress.findIndex((item) => item.hostname === projectHotExist.url);
    if (index !== -1) {
      ingress.splice(index, 1);
    }
    tunel.config.ingress = ingress;
    const tunelConfig = {
      config: tunel.config,
    };

    console.log(tunelConfig.config.ingress);
    await this.serviceTunnel.updateConfig(projectHotExist.zipProject.usuario.id_tunel, tunelConfig);

    //actualizamos el estado del projectHot

    await this.projecthotRepository.update(id, { estado: false });

    return { message: 'ProjectHot eliminado correctamente' };
  }
}
