"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const mail_service_1 = require("./mail/mail.service");
const mail_module_1 = require("./mail/mail.module");
const auth_module_1 = require("./auth/auth.module");
const rares_module_1 = require("./rares/rares.module");
const axios_1 = require("@nestjs/axios");
const perfiles_module_1 = require("./perfiles/perfiles.module");
const usuarios_module_1 = require("./usuarios/usuarios.module");
const tunels_module_1 = require("./tunels/tunels.module");
const zip_projects_module_1 = require("./zip_projects/zip_projects.module");
const comands_module_1 = require("./comands/comands.module");
const doker_module_1 = require("./doker/doker.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: process.env.MYSQL_HOST,
                port: 3306,
                username: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASSWORD,
                database: process.env.MYSQL_DATABASE,
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: true,
            }),
            perfiles_module_1.PerfilesModule,
            usuarios_module_1.UsuariosModule,
            mail_module_1.MailModule,
            auth_module_1.AuthModule,
            rares_module_1.RaresModule,
            axios_1.HttpModule,
            tunels_module_1.TunelsModule,
            zip_projects_module_1.ZipProjectsModule,
            comands_module_1.ComandsModule,
            doker_module_1.DokerModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, mail_service_1.MailService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map