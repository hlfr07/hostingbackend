import { RaresService } from './rares.service';
import { CreateRareDto } from './dto/create-rare.dto';
export declare class RaresController {
    private readonly raresService;
    private docker;
    constructor(raresService: RaresService);
    create(file: Express.Multer.File, createRareDto: CreateRareDto): Promise<import("@nestjs/common").HttpException | import("../zip_projects/entities/zip_project.entity").ZipProject>;
    private createTarStream;
}
