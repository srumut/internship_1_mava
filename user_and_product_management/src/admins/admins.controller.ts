import {
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Patch,
    Body,
    BadRequestException,
    NotFoundException,
    UseGuards,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AuthGuardAdmin } from 'src/auth/auth.guard.admin';

@Controller('admins')
export class AdminsController {
    constructor(private readonly service: AdminsService) {}

    @Get()
    @UseGuards(AuthGuardAdmin)
    async findAll() {
        return await this.service.findAll();
    }

    @Get(':id')
    @UseGuards(AuthGuardAdmin)
    async findById(@Param('id') id: string) {
        const admin = await this.service.findById(id);
        if (!admin) {
            throw new NotFoundException(`No admin with the id ${id} was found`);
        }
        return admin;
    }

    @Post()
    @UseGuards(AuthGuardAdmin)
    async create(@Body() dto: CreateAdminDto) {
        try {
            return await this.service.create(dto);
        } catch (error) {
            switch (error.code) {
                case 'P2002':
                    throw new BadRequestException(
                        `Unique constraint failed for ${error.meta.target}`,
                    );
            }
        }
    }

    @Delete(':id')
    @UseGuards(AuthGuardAdmin)
    async delete(@Param('id') id: string) {
        try {
            return await this.service.delete(id);
        } catch (error) {
            switch (error.code) {
                case 'P2025':
                    throw new BadRequestException(
                        `No admin with the id ${id} was found`,
                    );
            }
        }
    }

    @Patch(':id')
    @UseGuards(AuthGuardAdmin)
    async update(@Param('id') id: string, @Body() dto: UpdateAdminDto) {
        try {
            return await this.service.update(id, dto);
        } catch (error) {
            switch (error.code) {
                case 'P2025':
                    throw new BadRequestException(
                        `No admin with the id ${id} was found`,
                    );
            }
        }
    }
}
