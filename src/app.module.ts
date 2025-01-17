import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { RaresModule } from './rares/rares.module';
import { HttpModule } from '@nestjs/axios';
import { PerfilesModule } from './perfiles/perfiles.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { TunelsModule } from './tunels/tunels.module';
import { ZipProjectsModule } from './zip_projects/zip_projects.module';
import { ComandsModule } from './comands/comands.module';
import { DokerModule } from './doker/doker.module';
import { ProjectHotsModule } from './project_hots/project_hots.module';

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        isGlobal: true,
      }
    ),
    TypeOrmModule.forRoot({
      type: 'mysql', // Cambia el tipo a MySQL
      host: process.env.MYSQL_HOST ,
      port: 3306,
      username: process.env.MYSQL_USER ,
      password: process.env.MYSQL_PASSWORD ,
      database: process.env.MYSQL_DATABASE ,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    PerfilesModule,
    UsuariosModule,
    MailModule,
    AuthModule,
    RaresModule,
    HttpModule,
    TunelsModule,
    ZipProjectsModule,
    ComandsModule,
    DokerModule,
    ProjectHotsModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}