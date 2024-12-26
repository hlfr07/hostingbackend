import { CreateProjectHotDto } from './dto/create-project_hot.dto';
import { UpdateProjectHotDto } from './dto/update-project_hot.dto';
import { ProjectHot } from './entities/project_hot.entity';
import { Repository } from 'typeorm';
import { ZipProject } from 'src/zip_projects/entities/zip_project.entity';
import { DokerService } from 'src/doker/doker.service';
import { TunelsService } from 'src/tunels/tunels.service';
export declare class ProjectHotsService {
    private projecthotRepository;
    private zipprojectRepository;
    private readonly dokerService;
    private readonly serviceTunnel;
    constructor(projecthotRepository: Repository<ProjectHot>, zipprojectRepository: Repository<ZipProject>, dokerService: DokerService, serviceTunnel: TunelsService);
    create(createProjectHotDto: CreateProjectHotDto): Promise<ProjectHot>;
    findAll(): Promise<ProjectHot[]>;
    findOne(id: number): Promise<ProjectHot>;
    update(id: number, updateProjectHotDto: UpdateProjectHotDto): Promise<string>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
