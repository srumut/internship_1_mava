import { Injectable } from '@nestjs/common';
import { AdminsService } from 'src/admins/admins.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly adminsService: AdminsService,
    ) {}

    getUser(
        username: string,
    ): Promise<{ id: string; username: string; password: string } | null> {
        return this.usersService.findByUsername(username);
    }

    getAdmin(username: string) {
        return this.adminsService.findByUsername(username);
    }
}
