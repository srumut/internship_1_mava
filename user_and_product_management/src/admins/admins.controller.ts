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
    HttpStatus,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AuthGuardAdmin } from 'src/auth/auth.guard.admin';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('admins')
export class AdminsController {
    constructor(private readonly service: AdminsService) {}

    @Get()
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully retrieved all the admins',
    })
    @UseGuards(AuthGuardAdmin)
    async findAll() {
        return await this.service.findAll();
    }

    @Get(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully retrieved the admin',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Admin with the given id does not exist',
    })
    @UseGuards(AuthGuardAdmin)
    async findById(@Param('id') id: string) {
        const admin = await this.service.findById(id);
        if (!admin) {
            throw new NotFoundException(`No admin with the id ${id} was found`);
        }
        return admin;
    }

    @Post()
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Admin created successfully',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'One of the properties that must be unique is not unique',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: `Internal server error`,
    })
    @ApiBody({ type: CreateAdminDto })
    async create(@Body() dto: CreateAdminDto) {
        try {
            return await this.service.create(dto);
        } catch (error) {
            switch (error.code) {
                case 'P2002':
                    throw new BadRequestException(
                        `Unique constraint failed for ${error.meta.target}`,
                    );
                default:
                    console.error(error);
                    throw error;
            }
        }
    }

    @Delete(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully deleted the admin',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Admin with the given id does not exist',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: `Internal server error`,
    })
    @UseGuards(AuthGuardAdmin)
    async delete(@Param('id') id: string) {
        try {
            return await this.service.delete(id);
        } catch (error) {
            switch (error.code) {
                case 'P2025':
                    throw new NotFoundException(
                        `No admin with the id ${id} was found`,
                    );
                default:
                    console.error(error);
                    throw error;
            }
        }
    }

    @Patch(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully updated the admin',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Admin with the given id does not exist',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: `Internal server error`,
    })
    @UseGuards(AuthGuardAdmin)
    @ApiBody({ type: UpdateAdminDto })
    async update(@Param('id') id: string, @Body() dto: UpdateAdminDto) {
        try {
            return await this.service.update(id, dto);
        } catch (error) {
            switch (error.code) {
                case 'P2025':
                    throw new NotFoundException(
                        `No admin with the id ${id} was found`,
                    );
                default:
                    console.error(error);
                    throw error;
            }
        }
    }
}
