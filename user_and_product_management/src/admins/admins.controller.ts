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
    Logger,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AuthGuardAdmin } from 'src/auth/auth.guard.admin';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('admins')
export class AdminsController {
    private logger: Logger;

    constructor(private readonly service: AdminsService) {
        this.logger = new Logger(AdminsController.name);
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully retrieved all the admins',
    })
    @UseGuards(AuthGuardAdmin)
    @Get()
    async findAll() {
        return await this.service.findAll();
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully retrieved the admin',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Admin with the given id does not exist',
    })
    @UseGuards(AuthGuardAdmin)
    @Get(':id')
    async findById(@Param('id') id: string) {
        const admin = await this.service.findById(id);
        if (!admin) {
            throw new NotFoundException(`No admin with the id ${id} was found`);
        }
        return admin;
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Admin created successfully',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'One of the properties that must be unique is not unique',
    })
    @ApiBody({ type: CreateAdminDto })
    // TODO(umut): uncomment after you've create an admin to work with
    //@UseGuards(AuthGuardAdmin)
    @Post()
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
                    this.logger.error(error);
                    throw error;
            }
        }
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully deleted the admin',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Admin with the given id does not exist',
    })
    @UseGuards(AuthGuardAdmin)
    @Delete(':id')
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
                    this.logger.error(error);
                    throw error;
            }
        }
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully updated the admin',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Admin with the given id does not exist',
    })
    @ApiBody({ type: UpdateAdminDto })
    @UseGuards(AuthGuardAdmin)
    @Patch(':id')
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
                    this.logger.error(error);
                    throw error;
            }
        }
    }
}
