import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { MailModule } from '../mail/mail.module';
import { Perfile } from 'src/perfiles/entities/perfile.entity';
import { TunelsModule } from 'src/tunels/tunels.module';
import { DokerModule } from 'src/doker/doker.module';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Perfile]), MailModule, TunelsModule, DokerModule
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService]
})
export class UsuariosModule { }
