import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly httpService: HttpService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/hello")
  async getHello2(@Res() res: Response) {
    //crearemos un arreglo de objetos
    const data = [
      { nombre: "Juan", edad: 25 },
      { nombre: "Maria", edad: 30 },
      { nombre: "Pedro", edad: 35 }
    ];
    const nombre = "Juan";
    const apellido = "Perez";
    //hagamos un post a /cifrar pasandole clave y mensaje en el body y la respuesta la mostramos en la vista

    // Realizar el POST a /cifrar con los parámetros necesarios
    const postData = {
      clave: "luis",
      mensaje: "La feeeee"
    };

    try {
      // Usamos firstValueFrom para obtener el resultado de la promesa que devuelve el HTTP request
      const cifrado = await firstValueFrom(this.httpService.post('http://localhost:3000/cifrar', postData));

      console.log(cifrado.data); // Ver el resultado del POST (debe tener los datos cifrados)

      // Pasamos el resultado de cifrado a la vista
      res.render('home', {
        title: 'Mi página',
        message: 'Hola desde NestJS!',
        datos: data,
        nombre: nombre,
        apellido,
        cifrado: cifrado.data, // Pasamos los datos cifrados a la vista
      });
    } catch (error) {
      console.error('Error al cifrar:', error);
      res.render('index', {
        title: 'Error',
        message: 'Hubo un problema al cifrar el mensaje.',
      });
    }
  }
}
