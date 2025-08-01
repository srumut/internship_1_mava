import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AdminLoginDto } from './dto/admin-login.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { Public } from 'src/public.decorator';

@Controller()
export class AuthController {
    constructor(
        private readonly service: AuthService,
        private readonly jwtService: JwtService,
    ) {}

    @Public()
    @ApiOperation({ summary: 'User login endpoint' })
    @ApiOkResponse({ description: 'User logged in successfully' })
    @Post('login')
    async userLogin(@Body() dto: UserLoginDto) {
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

    @Public()
    @ApiOperation({ summary: 'Admin login endpoint' })
    @ApiOkResponse({ description: 'Admin logged in successfully' })
    @Post('admin/login')
    async adminLogin(@Body() dto: AdminLoginDto) {
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
