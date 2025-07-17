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
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller()
export class AuthController {
    constructor(
        private readonly service: AuthService,
        private readonly jwtService: JwtService,
    ) {}

    @ApiOperation({ summary: 'User login endpoint' })
    @ApiOkResponse({ description: 'User logged in successfully' })
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async userLogin(@Body() dto: LoginDto) {
        const user = await this.service.getUser(dto.username);
        if (!user) {
            throw new BadRequestException('Invalid username or password');
        }
        if (!bcrypt.compareSync(dto.password, user.password)) {
            throw new BadRequestException('Invalid username or password');
        }
        const payload = { sub: user.id, username: user.username, role: 'user' };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    @ApiOperation({ summary: 'Admin login endpoint' })
    @ApiOkResponse({ description: 'Admin logged in successfully' })
    @HttpCode(HttpStatus.OK)
    @Post('admin/login')
    async adminLogin(@Body() dto: LoginDto) {
        const admin = await this.service.getAdmin(dto.username);
        if (!admin) {
            throw new BadRequestException('Invalid username or password');
        }
        if (!bcrypt.compareSync(dto.password, admin.password)) {
            throw new BadRequestException('Invalid username or password');
        }
        const payload = {
            sub: admin.id,
            username: admin.username,
            role: 'admin',
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
