import {
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Patch,
    Body,
    NotFoundException,
    UseGuards,
    HttpStatus,
    Logger,
    Req,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuardAdmin } from 'src/auth/auth.guard.admin';
import { AuthGuardUser } from 'src/auth/auth.guard.user';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('users')
export class UsersController {
    private logger: Logger;

    constructor(private readonly service: UsersService) {
        this.logger = new Logger(UsersController.name);
    }

    @ApiOperation({ summary: 'Admin only endpoint to retrieve all the users' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully retrieved all the users',
    })
    @UseGuards(AuthGuardAdmin)
    @Get()
    async findAll() {
        return await this.service.findAll({});
    }

    @ApiOperation({ summary: 'Admin only endpoint to get an user by id' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully retrieved the user',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'User with the given id does not exist',
    })
    @UseGuards(AuthGuardAdmin)
    @Get('id/:id')
    async findById(@Param('id') id: string) {
        const user = await this.service.findById(id);
        if (!user) {
            throw new NotFoundException(`No user with the id ${id} was found`);
        }
        return user;
    }

    @ApiOperation({ summary: 'Get user by username' })
    @UseGuards(AuthGuardUser)
    @Get('u/:username')
    async findByUsername(
        @Param('username') username: string,
        @Req() req: Request,
    ) {
        const user = await this.service.findByUsername(username, {
            id: true,
            username: true,
            name: true,
            surname: true,
            profession: true,
            createdAt: true,
            updatedAt: true,
        });

        if (!user) {
            throw new NotFoundException(
                `No user with the username ${username} was found`,
            );
        }

        const resBody = {
            username: user.username,
            name: user.name,
            surname: user.surname,
            profession: user.profession,
        };

        if (req['user'].sub === user.id) {
            resBody['createdAt'] = user.createdAt;
            resBody['updatedAt'] = user.updatedAt;
        }

        return resBody;
    }

    @ApiOperation({ summary: 'Create an user' })
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
                    this.logger.error(error);
                    throw error;
            }
        }
    }

    @ApiOperation({ summary: 'Admin only endpoint to delete an user by id' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully deleted the user',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'User with the given id does not exist',
    })
    @UseGuards(AuthGuardAdmin)
    @Delete('id/:id')
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
                    this.logger.error(error);
                    throw error;
            }
        }
    }

    @ApiOperation({ summary: 'Delete user by username' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully deleted the user',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'User with the given id does not exist',
    })
    @UseGuards(AuthGuardUser)
    @Delete('u/:username')
    async deleteByUsername(
        @Req() req: Request,
        @Param('username') username: string,
    ) {
        const user = await this.service.findByUsername(username, {
            id: true,
        });
        if (!user) {
            throw new NotFoundException(
                `No user with the username ${username} was found`,
            );
        }

        try {
            if (req['user'].role === 'admin') {
                return await this.service.delete(user.id);
            }
            if (req['user'].sub === user?.id) {
                return await this.service.delete(user.id, { id: true });
            }
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
        throw new UnauthorizedException('Unauthorized');
    }

    @ApiOperation({ summary: 'Admin only endpoint to update an user by id' })
    @ApiBody({ type: UpdateUserDto })
    @Patch('id/:id')
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
                    this.logger.error(error);
                    throw error;
            }
        }
    }

    @ApiOperation({ summary: 'Update user by username' })
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully updated the user',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'User with the given id does not exist',
    })
    @UseGuards(AuthGuardUser)
    @Patch('u/:username')
    async updateByUsername(
        @Req() req: Request,
        @Param('username') username: string,
        @Body() dto: UpdateUserDto,
    ) {
        const user = await this.service.findByUsername(username, {
            id: true,
        });
        if (!user) {
            throw new NotFoundException(
                `No user with the username ${username} was found`,
            );
        }

        try {
            if (req['user'].role === 'admin') {
                return await this.service.update(user.id, dto);
            }
            if (req['user'].sub === user?.id) {
                return await this.service.update(user.id, dto, { id: true });
            }
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
        throw new UnauthorizedException('Unauthorized');
    }
}
