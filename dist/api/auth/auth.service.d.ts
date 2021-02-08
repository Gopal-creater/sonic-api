import { GlobalAwsService } from 'src/shared/modules/global-aws/global-aws.service';
import { AuthConfig } from './config/auth.config';
import { KeygenService } from '../../shared/modules/keygen/keygen.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
export declare class AuthService {
    private readonly authConfig;
    private readonly globalAwsService;
    private readonly keygenService;
    private userPool;
    private cognitoIdentityServiceProvider;
    constructor(authConfig: AuthConfig, globalAwsService: GlobalAwsService, keygenService: KeygenService);
    registerUser(registerDTO: RegisterDTO): Promise<unknown>;
    authenticateUser(loginDTO: LoginDto): Promise<unknown>;
}
