import {
    Body,
    Controller,
    HttpStatus,
    Post,
    HttpCode,
    BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Controller()
export class AuthController {
    constructor(
        private readonly service: AuthService,
        private readonly jwtService: JwtService,
    ) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async userLogin(@Body() dto: LoginDto) {
        const user = await this.service.getUser(dto.username);
        if (!user) {
            throw new BadRequestException('Invalid username or password');
        }
        if (!bcrypt.compareSync(dto.password, user.password)) {
            throw new BadRequestException('Invalid username or password');
        }
        const payload = { sub: user.username, role: 'user' };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    @Post('admin/login')
    @HttpCode(HttpStatus.OK)
    async adminLogin(@Body() dto: LoginDto) {
        const admin = await this.service.getAdmin(dto.username);
        if (!admin) {
            throw new BadRequestException('Invalid username or password');
        }
        if (!bcrypt.compareSync(dto.password, admin.password)) {
            throw new BadRequestException('Invalid username or password');
        }
        const payload = { sub: admin.username, role: 'admin' };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
