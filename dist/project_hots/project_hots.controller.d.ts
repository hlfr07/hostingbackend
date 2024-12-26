import { ProjectHotsService } from './project_hots.service';
import { CreateProjectHotDto } from './dto/create-project_hot.dto';
export declare class ProjectHotsController {
    private readonly projectHotsService;
    constructor(projectHotsService: ProjectHotsService);
    create(createProjectHotDto: CreateProjectHotDto): Promise<import("./entities/project_hot.entity").ProjectHot>;
    findAll(): Promise<import("./entities/project_hot.entity").ProjectHot[]>;
    findOne(id: string): Promise<import("./entities/project_hot.entity").ProjectHot>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
