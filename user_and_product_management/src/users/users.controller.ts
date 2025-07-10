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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuardAdmin } from 'src/auth/auth.guard.admin';
import { AuthGuardUser } from 'src/auth/auth.guard.user';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
    constructor(private readonly service: UsersService) {}

    @Get()
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully retrieved all the users',
    })
    @UseGuards(AuthGuardAdmin)
    async findAll() {
        return await this.service.findAll();
    }

    @Get(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully retrieved the user',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'User with the given id does not exist',
    })
    @UseGuards(AuthGuardUser)
    async findById(@Param('id') id: string) {
        const user = await this.service.findById(id);
        if (!user) {
            throw new NotFoundException(`No user with the id ${id} was found`);
        }
        return user;
    }

    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'User created successfully',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'One of the properties that must be unique is not unique',
    })
    @ApiBody({ type: CreateUserDto })
    @Post()
    async create(@Body() dto: CreateUserDto) {
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

    @UseGuards(AuthGuardAdmin)
    @Delete(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully deleted the user',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'User with the given id does not exist',
    })
    async delete(@Param('id') id: string) {
        try {
            return await this.service.delete(id);
        } catch (error) {
            switch (error.code) {
                case 'P2025':
                    throw new NotFoundException(
                        `No user with the id ${id} was found`,
                    );
                default:
                    console.error(error);
                    throw error;
            }
        }
    }

    @ApiBody({ type: UpdateUserDto })
    @Patch(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully updated the user',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'User with the given id does not exist',
    })
    @UseGuards(AuthGuardAdmin)
    async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        try {
            return await this.service.update(id, dto);
        } catch (error) {
            switch (error.code) {
                case 'P2025':
                    throw new NotFoundException(
                        `No user with the id ${id} was found`,
                    );
                default:
                    console.error(error);
                    throw error;
            }
        }
    }
}
