"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TunelsService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const fs = require("fs");
let TunelsService = class TunelsService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async create(user) {
        try {
            const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
            const tunnelSecret = process.env.CLOUDFLARE_TUNNEL_SECRET;
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.post(`https://api.cloudflare.com/client/v4/accounts/${accountId}/cfd_tunnel`, {
                config_src: 'cloudflare',
                name: user,
                tunnel_secret: tunnelSecret,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Auth-Email': process.env.CLOUDFLARE_EMAIL,
                    'X-Auth-Key': process.env.CLOUDFLARE_API_KEY,
                },
            }));
            const { id: tunnelId, name } = response.data.result;
            const jsonData = {
                AccountTag: accountId,
                TunnelSecret: tunnelSecret,
                TunnelID: tunnelId,
            };
            const filePath = `./config/${name}-credentials.json`;
            fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
            const yamlData = [
                `tunnel: ${tunnelId}`,
                `credentials-file: ./${name}-credentials.json`,
                '',
                'ingress:',
                '  - service: http_status:404'
            ].join('\n');
            const yamlFilePath = `./config/${name}-config.yml`;
            fs.writeFileSync(yamlFilePath, yamlData);
            return { tunnelId };
        }
        catch (error) {
            throw new common_1.HttpException("Ya tienes un túnel con este nombre. Elimina el túnel existente o elige un nombre diferente para el nuevo túnel.", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAll() {
        const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Email': process.env.CLOUDFLARE_EMAIL,
                'X-Auth-Key': process.env.CLOUDFLARE_API_KEY,
            },
        };
        try {
            const response = await this.httpService
                .get(`https://api.cloudflare.com/client/v4/accounts/${accountId}/cfd_tunnel`, options)
                .toPromise();
            return response.data.result;
        }
        catch (err) {
            console.error(err);
            throw new common_1.HttpException('Error al obtener la lista de tuneles', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
        const tunnelId = id;
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Email': process.env.CLOUDFLARE_EMAIL,
                'X-Auth-Key': process.env.CLOUDFLARE_API_KEY,
            },
        };
        try {
            const response = await this.httpService
                .get(`https://api.cloudflare.com/client/v4/accounts/${accountId}/cfd_tunnel/${tunnelId}`, options)
                .toPromise();
            return response.data.result;
        }
        catch (err) {
            console.error(err);
            throw new common_1.HttpException('Error al obtener los detalles del túnel', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, updateuser) {
        console.log(id, updateuser);
        try {
            const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
            const tunnelSecret = process.env.CLOUDFLARE_TUNNEL_SECRET;
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.patch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/cfd_tunnel/${id}`, {
                name: updateuser,
                tunnel_secret: tunnelSecret,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Auth-Email': process.env.CLOUDFLARE_EMAIL,
                    'X-Auth-Key': process.env.CLOUDFLARE_API_KEY,
                }
            }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException("Hubo un error al actualizar. ¡Por favor intentelo nuevamente!", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async remove(id) {
        const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
        const tunnelId = id;
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Email': process.env.CLOUDFLARE_EMAIL,
                'X-Auth-Key': process.env.CLOUDFLARE_API_KEY,
            },
        };
        try {
            const response = await this.httpService
                .delete(`https://api.cloudflare.com/client/v4/accounts/${accountId}/cfd_tunnel/${tunnelId}`, options)
                .toPromise();
            return response.data;
        }
        catch (err) {
            console.error(err);
            throw new Error('Error removing tunnel data from Cloudflare API');
        }
    }
    async getConfig(id) {
        const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
        const tunnelId = id;
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Email': process.env.CLOUDFLARE_EMAIL,
                'X-Auth-Key': process.env.CLOUDFLARE_API_KEY,
            },
        };
        try {
            const response = await this.httpService
                .get(`https://api.cloudflare.com/client/v4/accounts/${accountId}/cfd_tunnel/${tunnelId}/configurations`, options)
                .toPromise();
            return response.data.result;
        }
        catch (err) {
            console.error(err);
            throw new common_1.HttpException('Error al obtener la configuración del túnel', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateConfig(id, config) {
        console.log("actualizando config", config, id);
        const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Email': process.env.CLOUDFLARE_EMAIL,
                'X-Auth-Key': process.env.CLOUDFLARE_API_KEY,
            },
        };
        const ingress = config?.config?.ingress || [];
        const newHostnames = ingress
            .filter((entry) => entry.hostname)
            .map((entry) => entry.hostname.split('.')[0]);
        const duplicates = newHostnames.filter((item, index) => newHostnames.indexOf(item) !== index);
        if (duplicates.length > 0) {
            throw new common_1.HttpException(`Los siguientes hostnames están duplicados: ${duplicates.join(', ')}`, common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const oldConfig = await this.getConfig(id);
            const oldIngress = oldConfig?.config?.ingress || [];
            const oldHostnames = oldIngress
                .filter((entry) => entry.hostname)
                .map((entry) => entry.hostname.split('.')[0]);
            const removedHostnames = oldHostnames.filter((hostname) => !newHostnames.includes(hostname));
            for (const hostname of removedHostnames) {
                const dnsRecord = await this.findDnsRecordByHostname(hostname);
                if (dnsRecord) {
                    await this.deleteDns(dnsRecord.id);
                    console.log(`DNS eliminado para el hostname: ${hostname}`);
                }
            }
            const existingDnsRecords = await this.getDns();
            const existingDns = existingDnsRecords.map((record) => record.name.split('.')[0]);
            const hostnamesToCreate = newHostnames.filter((hostname) => !existingDns.includes(hostname));
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
                await this.createDns(dnsConfig);
                console.log(`DNS creado para el hostname: ${hostname}`);
            }
            const response = await this.httpService
                .put(`https://api.cloudflare.com/client/v4/accounts/${accountId}/cfd_tunnel/${id}/configurations`, config, options)
                .toPromise();
            return response.data.result;
        }
        catch (err) {
            console.error(err);
            throw new common_1.HttpException('Error al actualizar la configuración del túnel', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getDns() {
        const id_zona = process.env.ZONE_ID;
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Email': process.env.CLOUDFLARE_EMAIL,
                'X-Auth-Key': process.env.CLOUDFLARE_API_KEY,
            },
        };
        try {
            const response = await this.httpService
                .get(`https://api.cloudflare.com/client/v4/zones/${id_zona}/dns_records`, options)
                .toPromise();
            return response.data.result;
        }
        catch (err) {
            console.error(err);
            throw new common_1.HttpException('Error al obtener la lista de tuneles', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createDns(createdns) {
        const id_zona = process.env.ZONE_ID;
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Email': process.env.CLOUDFLARE_EMAIL,
                'X-Auth-Key': process.env.CLOUDFLARE_API_KEY,
            },
        };
        try {
            const response = await this.httpService
                .post(`https://api.cloudflare.com/client/v4/zones/${id_zona}/dns_records`, createdns, options)
                .toPromise();
            return response.data.result;
        }
        catch (err) {
            console.error(err);
            throw new common_1.HttpException('Error al obtener la lista de tuneles', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateDns(id, updatedns) {
        const id_zona = process.env.ZONE_ID;
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Email': process.env.CLOUDFLARE_EMAIL,
                'X-Auth-Key': process.env.CLOUDFLARE_API_KEY,
            },
        };
        try {
            const response = await this.httpService
                .put(`https://api.cloudflare.com/client/v4/zones/${id_zona}/dns_records/${id}`, updatedns, options)
                .toPromise();
            return response.data.result;
        }
        catch (err) {
            console.error(err);
            throw new common_1.HttpException('Error al obtener la lista de tuneles', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteDns(id) {
        const id_zona = process.env.ZONE_ID;
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Email': process.env.CLOUDFLARE_EMAIL,
                'X-Auth-Key': process.env.CLOUDFLARE_API_KEY,
            },
        };
        try {
            const response = await this.httpService
                .delete(`https://api.cloudflare.com/client/v4/zones/${id_zona}/dns_records/${id}`, options)
                .toPromise();
            return response.data;
        }
        catch (err) {
            console.error(err);
            throw new common_1.HttpException('Error al obtener la lista de tuneles', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findDnsRecordByHostname(hostname) {
        const existingDnsRecords = await this.getDns();
        return existingDnsRecords.find((record) => record.name.split('.')[0] === hostname);
    }
};
exports.TunelsService = TunelsService;
exports.TunelsService = TunelsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], TunelsService);
//# sourceMappingURL=tunels.service.js.map