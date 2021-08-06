import { GlobalAwsService } from '../../shared/modules/global-aws/global-aws.service';
import { AuthConfig } from './config/auth.config';
import { LoginDto } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
export declare class AuthService {
    private readonly authConfig;
    private readonly globalAwsService;
    private userPool;
    private cognitoIdentityServiceProvider;
    constructor(authConfig: AuthConfig, globalAwsService: GlobalAwsService);
    registerUser(registerDTO: RegisterDTO): Promise<unknown>;
    authenticateUser(loginDTO: LoginDto): Promise<unknown>;
}
