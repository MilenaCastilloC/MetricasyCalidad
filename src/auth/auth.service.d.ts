import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UserService, jwtService: JwtService);
    validateUser(username: string, password: string): Promise<any>;
    login(req: any): Promise<{
        token: string;
    }>;
}
