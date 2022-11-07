import { Injectable } from '@nestjs/common';
import { Role } from './role.enum';
import { User } from './user';

@Injectable()
export class UserService {
    private users: User[] = [
        new User(1, "admin", "oS1RPd82tG", [Role.UserGastronomy, Role.UserCountry,Role.UserProduct,Role.UserReceipt,Role.UserRestaurant,Role.UserWrite,Role.UserDelete]),
        new User(2, "usuarioConsulta", "i44Ln0dnwL", [Role.UserGastronomy, Role.UserCountry,Role.UserProduct,Role.UserReceipt,Role.UserRestaurant]),
        new User(3, "usuarioCulturaGastronomica", "4118TKBCRh", [Role.UserGastronomy]),
        new User(4, "usuarioPais", "GWkDF783lf", [Role.UserCountry]),
        new User(5, "usuarioProductoCaracteristico", "kmfvf0I627", [Role.UserProduct]),
        new User(6, "usuarioReceta", "VNo35MR0OL", [Role.UserReceipt]),
        new User(7, "usuarioRestaurante", "h3z61q6BzL", [Role.UserRestaurant]),
        new User(8, "usuarioEscritura", "JYCX1V23Pi", [Role.UserWrite]),
        new User(9, "usuarioEliminacion", "	o3QlF1Hv6x", [Role.UserDelete])
    ];

    async findOne(username: string): Promise<User | undefined> {
        return this.users.find(user => user.username === username);
    }
}
