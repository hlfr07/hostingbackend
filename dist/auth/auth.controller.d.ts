import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/login-auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    create(createAuthDto: CreateAuthDto): Promise<{
        token: string;
        refreshToken: string;
    }>;
}
