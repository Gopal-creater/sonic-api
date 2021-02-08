import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDTO: RegisterDTO): Promise<unknown>;
    login(authenticateRequest: LoginDto): Promise<unknown>;
}
