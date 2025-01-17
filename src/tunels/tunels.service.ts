import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTunelDto } from './dto/create-tunel.dto';
import { UpdateTunelDto } from './dto/update-tunel.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as fs from 'fs';

@Injectable()
export class TunelsService {
  constructor(private httpService: HttpService) { }

  async create(user: string) {
    try {
      const accountId = process.env.CLOUDFLARE_ACCOUNT_ID; // Obtener account_id
      const tunnelSecret = process.env.CLOUDFLARE_TUNNEL_SECRET; // Obtener tunnel_secret

      // Hacemos la solicitud a la API de Cloudflare para crear el túnel
      const response = await lastValueFrom(
        this.httpService.post(
          `https://api.cloudflare.com/client/v4/accounts/${accountId}/cfd_tunnel`,
          { // Datos a enviar en el cuerpo de la solicitud
            config_src: 'cloudflare',
            name: user, // Aquí estamos utilizando el nombre del usuario para crear el túnel
            tunnel_secret: tunnelSecret,
          },
          { // Encabezados de la solicitud
            headers: {
              'Content-Type': 'application/json',
              'X-Auth-Email': process.env.CLOUDFLARE_EMAIL, // Obtener email
              'X-Auth-Key': process.env.CLOUDFLARE_API_KEY, // Obtener api_key
            },
          },
        ),
      );

      const { id: tunnelId, name } = response.data.result;

      // Crear el contenido del archivo JSON
      const jsonData = {
        AccountTag: accountId,
        TunnelSecret: tunnelSecret,
        TunnelID: tunnelId,
      };

      // Guardar el archivo JSON localmente
      const filePath = `./config/${name}-credentials.json`;
      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

      // Crear el contenido del archivo YAML con una estructura adecuada
      const yamlData = [
        `tunnel: ${tunnelId}`,
        `credentials-file: ./${name}-credentials.json`,
        '',
        'ingress:',
        '  - service: http_status:404'
      ].join('\n');

      // Guardar el archivo YAML localmente
      const yamlFilePath = `./config/${name}-config.yml`;
      fs.writeFileSync(yamlFilePath, yamlData);

      // Retornar el ID del túnel creado y la ubicación del archivo
      return { tunnelId };
    } catch (error) {
      throw new HttpException(
        "Ya tienes un túnel con este nombre. Elimina el túnel existente o elige un nombre diferente para el nuevo túnel.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID; // Obtener account_id desde las variables de entorno
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Email': process.env.CLOUDFLARE_EMAIL, // Obtener el email desde las variables de entorno
        'X-Auth-Key': process.env.CLOUDFLARE_API_KEY, // Obtener la API key desde las variables de entorno
      },
    };

    try {
      const response = await this.httpService
        .get(`https://api.cloudflare.com/client/v4/accounts/${accountId}/cfd_tunnel`, options)
        .toPromise();

      return response.data.result; // Devuelve la respuesta de la API
    } catch (err) {
      console.error(err);
      throw new HttpException('Error al obtener la lista de tuneles', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async findOne(id: string) {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID; // Obtener el account_id desde las variables de entorno
    const tunnelId = id; // El id que se pasa en la URL es el tunnel_id

    const options = {
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Email': process.env.CLOUDFLARE_EMAIL, // Obtener el email desde las variables de entorno
        'X-Auth-Key': process.env.CLOUDFLARE_API_KEY, // Obtener la API key desde las variables de entorno
      },
    };

    try {
      const response = await this.httpService
        .get(`https://api.cloudflare.com/client/v4/accounts/${accountId}/cfd_tunnel/${tunnelId}`, options)
        .toPromise();
      return response.data.result; // Devuelve la respuesta de la API
    } catch (err) {
      console.error(err);
      throw new HttpException('Error al obtener los detalles del túnel', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async update(id: string, updateuser: string) {
    console.log(id, updateuser);

    try {
      const accountId = process.env.CLOUDFLARE_ACCOUNT_ID; // Obtener account_id
      const tunnelSecret = process.env.CLOUDFLARE_TUNNEL_SECRET; // Obtener tunnel_secret

      // Hacemos la solicitud a la API de Cloudflare para crear el túnel
      const response = await lastValueFrom(
        this.httpService.patch(
          `https://api.cloudflare.com/client/v4/accounts/${accountId}/cfd_tunnel/${id}`,
          { // Datos a enviar en el cuerpo de la solicitud
            name: updateuser,  // Aquí estamos utilizando el nombre del usuario para crear el túnel
            tunnel_secret: tunnelSecret,
          },
          { // Encabezados de la solicitud
            headers: {
              'Content-Type': 'application/json',
              'X-Auth-Email': process.env.CLOUDFLARE_EMAIL, // Obtener email
              'X-Auth-Key': process.env.CLOUDFLARE_API_KEY, // Obtener api_key
            }
          }
        ),
      );

      // Retornar el ID del túnel creado
      return response.data;
    } catch (error) {
      throw new HttpException("Hubo un error al actualizar. ¡Por favor intentelo nuevamente!", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async remove(id: string) {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID; // Obtener account_id desde las variables de entorno
    const tunnelId = id; // El id que se pasa es el tunnel_id
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Email': process.env.CLOUDFLARE_EMAIL, // Obtener el email desde las variables de entorno
        'X-Auth-Key': process.env.CLOUDFLARE_API_KEY, // Obtener la API key desde las variables de entorno
      },
    };

    try {
      const response = await this.httpService
        .delete(`https://api.cloudflare.com/client/v4/accounts/${accountId}/cfd_tunnel/${tunnelId}`, options)
        .toPromise();

      return response.data; // Devuelve la respuesta de la API con el resultado de la eliminación
    } catch (err) {
      console.error(err);
      throw new Error('Error removing tunnel data from Cloudflare API');
    }
  }

  //ahora creamos el método para obtener la configuración de un túnel
  async getConfig(id: string) {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID; // Obtener account_id desde las variables de entorno
    const tunnelId = id; // El id que se pasa en la URL es el tunnel_id
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Email': process.env.CLOUDFLARE_EMAIL, // Obtener el email desde las variables de entorno
        'X-Auth-Key': process.env.CLOUDFLARE_API_KEY, // Obtener la API key desde las variables de entorno
      },
    };

    try {
      const response = await this.httpService
        .get(`https://api.cloudflare.com/client/v4/accounts/${accountId}/cfd_tunnel/${tunnelId}/configurations`, options)
        .toPromise();
      return response.data.result; // Devuelve la respuesta de la API
    } catch (err) {
      console.error(err);
      throw new HttpException('Error al obtener la configuración del túnel', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //ahora creamos el método para actualizar la configuración de un túnel
  async updateConfig(id: string, config: any) {
    console.log("actualizando config", config, id);
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Email': process.env.CLOUDFLARE_EMAIL,
        'X-Auth-Key': process.env.CLOUDFLARE_API_KEY,
      },
    };
  
    // Extraer los hostnames del config ingresado
    const ingress = config?.config?.ingress || [];
    const newHostnames = ingress
      .filter((entry: any) => entry.hostname)
      .map((entry: any) => entry.hostname.split('.')[0]); // Obtener solo el subdominio
  
    // Verificar duplicados en la lista de hostnames
    const duplicates = newHostnames.filter((item, index) => newHostnames.indexOf(item) !== index);
    if (duplicates.length > 0) {
      throw new HttpException(`Los siguientes hostnames están duplicados: ${duplicates.join(', ')}`, HttpStatus.BAD_REQUEST);
    }
  
    try {
      // Obtener la configuración antigua usando getConfig
      const oldConfig = await this.getConfig(id);
      const oldIngress = oldConfig?.config?.ingress || [];
      const oldHostnames = oldIngress
        .filter((entry: any) => entry.hostname)
        .map((entry: any) => entry.hostname.split('.')[0]); // Hostnames de la antigua configuración
  
      // Identificar hostnames que ya no están en la nueva configuración
      const removedHostnames = oldHostnames.filter((hostname) => !newHostnames.includes(hostname));
  
      // Eliminar los DNS para los hostnames que fueron eliminados
      for (const hostname of removedHostnames) {
        const dnsRecord = await this.findDnsRecordByHostname(hostname); // Método para buscar el DNS por hostname
        if (dnsRecord) {
          await this.deleteDns(dnsRecord.id); // Eliminar el registro DNS
          console.log(`DNS eliminado para el hostname: ${hostname}`);
        }
      }
  
      // Obtener la lista de DNS existentes usando getDns()
      const existingDnsRecords = await this.getDns();
      const existingDns = existingDnsRecords.map((record: any) => record.name.split('.')[0]); // Subdominios existentes
  
      // Filtrar los hostnames que no existen en DNS
      const hostnamesToCreate = newHostnames.filter((hostname) => !existingDns.includes(hostname));
  
      // Crear los registros DNS para los hostnames nuevos
      for (const hostname of hostnamesToCreate) {
        const dnsConfig = {
          comment: "Domain verification record",
          name: hostname,
          proxied: true,
          settings: {},
          tags: [],
          ttl: 3600,
          content: `${id}.cfargotunnel.com`,
          type: "CNAME",
        };
  
        await this.createDns(dnsConfig); // Llamar al método para crear el DNS
        console.log(`DNS creado para el hostname: ${hostname}`);
      }
  
      // Continuar con la actualización del túnel
      const response = await this.httpService
        .put(`https://api.cloudflare.com/client/v4/accounts/${accountId}/cfd_tunnel/${id}/configurations`, config, options)
        .toPromise();
  
      return response.data.result; // Devuelve la respuesta de la API
    } catch (err) {
      console.error(err);
      throw new HttpException('Error al actualizar la configuración del túnel', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  


  //ahora creamos el método para obtener los dns de un túnel
  async getDns() {
    const id_zona = process.env.ZONE_ID; // Obtener account_id desde las variables de entorno
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Email': process.env.CLOUDFLARE_EMAIL, // Obtener el email desde las variables de entorno
        'X-Auth-Key': process.env.CLOUDFLARE_API_KEY, // Obtener la API key desde las variables de entorno
      },
    };

    try {
      const response = await this.httpService
        .get(`https://api.cloudflare.com/client/v4/zones/${id_zona}/dns_records`, options)
        .toPromise();

      return response.data.result; // Devuelve la respuesta de la API
    } catch (err) {
      console.error(err);
      throw new HttpException('Error al obtener la lista de tuneles', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createDns(createdns: any) {
    const id_zona = process.env.ZONE_ID; // Obtener account_id desde las variables de entorno
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Email': process.env.CLOUDFLARE_EMAIL, // Obtener el email desde las variables de entorno
        'X-Auth-Key': process.env.CLOUDFLARE_API_KEY, // Obtener la API key desde las variables de entorno
      },
    };

    try {
      const response = await this.httpService
        .post(`https://api.cloudflare.com/client/v4/zones/${id_zona}/dns_records`, createdns, options)
        .toPromise();

      return response.data.result; // Devuelve la respuesta de la API
    } catch (err) {
      console.error(err);
      throw new HttpException('Error al obtener la lista de tuneles', HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  async updateDns(id: string, updatedns: any) {
    const id_zona = process.env.ZONE_ID; // Obtener account_id desde las variables de entorno
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Email': process.env.CLOUDFLARE_EMAIL, // Obtener el email desde las variables de entorno
        'X-Auth-Key': process.env.CLOUDFLARE_API_KEY, // Obtener la API key desde las variables de entorno
      },
    };

    try {
      const response = await this.httpService
        .put(`https://api.cloudflare.com/client/v4/zones/${id_zona}/dns_records/${id}`, updatedns, options)
        .toPromise();

      return response.data.result; // Devuelve la respuesta de la API
    } catch (err) {
      console.error(err);
      throw new HttpException('Error al obtener la lista de tuneles', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteDns(id: string) {
    const id_zona = process.env.ZONE_ID; // Obtener account_id desde las variables de entorno
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Email': process.env.CLOUDFLARE_EMAIL, // Obtener el email desde las variables de entorno
        'X-Auth-Key': process.env.CLOUDFLARE_API_KEY, // Obtener la API key desde las variables de entorno
      },
    };

    try {
      const response = await this.httpService
        .delete(`https://api.cloudflare.com/client/v4/zones/${id_zona}/dns_records/${id}`, options)
        .toPromise();

      return response.data; // Devuelve la respuesta de la API
    } catch (err) {
      console.error(err);
      throw new HttpException('Error al obtener la lista de tuneles', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async findDnsRecordByHostname(hostname: string) {
    const existingDnsRecords = await this.getDns();
    return existingDnsRecords.find((record: any) => record.name.split('.')[0] === hostname);
  }

  //ahora haremos un metodo para obtener token de autenticacion del tunel
  async getToken(id: string) {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID; // Obtener account_id desde las variables de entorno
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Email': process.env.CLOUDFLARE_EMAIL, // Obtener el email desde las variables de entorno
        'X-Auth-Key': process.env.CLOUDFLARE_API_KEY, // Obtener la API key desde las variables de entorno
      },
    };

    try {
      const response = await this.httpService
        .get(`https://api.cloudflare.com/client/v4/accounts/${accountId}/cfd_tunnel/${id}/token`, options)
        .toPromise();
        const data = {
          token: response.data.result,
        }

      return data; // Devuelve la respuesta de la API
    } catch (err) {
      console.error(err);
      throw new HttpException('Error al obtener la lista de tuneles', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
}
