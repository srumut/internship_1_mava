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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly service: UsersService) {}

    @Get()
    async findAll() {
        return await this.service.findAll();
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        const user = await this.service.findById(id);
        if (!user) {
            throw new NotFoundException(`No user with the id ${id} was found`);
        }
        return user;
    }

    @Post()
    async create(@Body() dto: CreateUserDto) {
        try {
            return await this.service.create(dto);
        } catch (error) {
            console.error(JSON.stringify(error));
            switch (error.code) {
                case 'P2002':
                    throw new BadRequestException(
                        `Unique constraint failed for ${error.meta.target}`,
                    );
            }
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        try {
            return await this.service.delete(id);
        } catch (error) {
            switch (error.code) {
                case 'P2025':
                    throw new BadRequestException(
                        `No user with the id ${id} was found`,
                    );
            }
        }
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        try {
            return await this.service.update(id, dto);
        } catch (error) {
            switch (error.code) {
                case 'P2025':
                    throw new BadRequestException(
                        `No user with the id ${id} was found`,
                    );
            }
        }
    }
}
