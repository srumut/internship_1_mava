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
    HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuardAdmin } from 'src/auth/auth.guard.admin';
import { AuthGuardUser } from 'src/auth/auth.guard.user';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiResponse,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { OrderProductDto } from './dto/order.dto';
import { Order, UserOrder } from './types';

@Controller('users')
export class UsersController {
    private logger: Logger;

    constructor(private readonly service: UsersService) {
        this.logger = new Logger(UsersController.name);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Admin only endpoint to retrieve all the users' })
    @ApiOkResponse({
        description: 'Successfully retrieved all the users',
    })
    @UseGuards(AuthGuardAdmin)
    @HttpCode(HttpStatus.OK)
    @Get()
    async findAll() {
        return await this.service.findAll();
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Admin only endpoint to get an user by id' })
    @ApiOkResponse({
        description: 'Successfully retrieved the user',
    })
    @ApiNotFoundResponse({
        description: 'User with the given id does not exist',
    })
    @UseGuards(AuthGuardAdmin)
    @HttpCode(HttpStatus.OK)
    @Get('id/:id')
    async findById(@Param('id') id: string) {
        const user = await this.service.findById(id);
        if (!user) {
            throw new NotFoundException(`No user with the id ${id} was found`);
        }
        return user;
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user by username' })
    @ApiOkResponse({
        description: 'Successfully retrieved the user with the given username',
    })
    @UseGuards(AuthGuardUser)
    @HttpCode(HttpStatus.OK)
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
    @ApiCreatedResponse({
        description: 'User created successfully',
    })
    @ApiBadRequestResponse({
        description: 'One of the properties that must be unique is not unique',
    })
    @ApiBody({ type: CreateUserDto })
    @HttpCode(HttpStatus.CREATED)
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

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Admin only endpoint to delete an user by id' })
    @ApiOkResponse({
        description: 'Successfully deleted the user',
    })
    @ApiNotFoundResponse({
        description: 'User with the given id does not exist',
    })
    @UseGuards(AuthGuardAdmin)
    @HttpCode(HttpStatus.OK)
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

    @ApiBearerAuth()
    @ApiOperation({
        summary:
            'Delete user by username, users can delete only their own account.',
    })
    @ApiOkResponse({
        description: 'Successfully deleted the user',
    })
    @ApiNotFoundResponse({
        description: 'User with the given id does not exist',
    })
    @UseGuards(AuthGuardUser)
    @HttpCode(HttpStatus.OK)
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

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Admin only endpoint to update an user by id' })
    @ApiBody({ type: UpdateUserDto })
    @ApiOkResponse({
        description: 'Successfully updated the user',
    })
    @ApiNotFoundResponse({
        description: 'User with the given id does not exist',
    })
    @UseGuards(AuthGuardAdmin)
    @HttpCode(HttpStatus.OK)
    @Patch('id/:id')
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

    @ApiBearerAuth()
    @ApiOperation({
        summary:
            'Update user by username, users can update only their own account.',
    })
    @ApiBody({ type: UpdateUserDto })
    @ApiOkResponse({
        description: 'Successfully updated the user',
    })
    @ApiNotFoundResponse({
        description: 'User with the given id does not exist',
    })
    @ApiBadRequestResponse({
        description: 'Unique constraint failed for one of the fields',
    })
    @UseGuards(AuthGuardUser)
    @HttpCode(HttpStatus.OK)
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
            if (req['user'].sub === user.id) {
                return await this.service.update(user.id, dto, { id: true });
            }
        } catch (error) {
            switch (error.code) {
                case 'P2002':
                    throw new BadRequestException(
                        `Unique contraint failed for ${error.meta.target}`,
                    );
                default:
                    this.logger.error(error);
                    throw error;
            }
        }
        throw new UnauthorizedException('Unauthorized');
    }

    @ApiBearerAuth()
    @ApiOperation({
        summary:
            'Admin only endpoint to retrieve all the orders made by every user',
    })
    @ApiOkResponse({ description: 'Successfully retrieved orders.' })
    @ApiResponse({ type: [UserOrder] })
    @UseGuards(AuthGuardAdmin)
    @HttpCode(HttpStatus.OK)
    @Get('orders')
    async findAllOrders() {
        return await this.service.findAllOrders();
    }

    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Users can retrieve all orders made by them',
    })
    @ApiOkResponse({ description: 'Successfully retrieved orders.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized request' })
    @ApiResponse({ type: [Order] })
    @UseGuards(AuthGuardUser)
    @HttpCode(HttpStatus.OK)
    @Get('u/:username/orders')
    async userOrders(@Param('username') username: string, @Req() req: Request) {
        if (username !== req['user'].username) {
            throw new UnauthorizedException();
        }
        return await this.service.findAllOrdersByUser(username);
    }

    @ApiBearerAuth()
    @ApiBody({ type: [OrderProductDto] })
    @ApiOkResponse({ description: 'Products ordered successfully' })
    @ApiBadRequestResponse({
        description:
            'Either an admin tried to order or stock for the one or more products are not enough',
    })
    @ApiNotFoundResponse({
        description: 'One or more products have not enough stock',
    })
    @UseGuards(AuthGuardUser)
    @HttpCode(HttpStatus.OK)
    @Post('orders')
    async order(@Req() req: Request, @Body() dtos: OrderProductDto[]) {
        if (req['user'].role == 'admin') {
            throw new BadRequestException('Admins can not order any product');
        }
        return await this.service.order(req['user'].sub, dtos);
    }

    @UseGuards(AuthGuardUser)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('u/:username/orders/:order_id')
    async deleteOrder(
        @Param('username') username: string,
        @Param('order_id') order_id: string,
        @Req() req: Request,
    ) {
        if (req['user'].role === 'user' && username !== req['user'].username) {
            throw new UnauthorizedException();
        }
        try {
            return await this.service.deleteOrder(order_id);
        } catch (error) {
            switch (error.code) {
                case 'P2025':
                    throw new BadRequestException(
                        `Order with id ${order_id} could not be found`,
                    );
                default:
                    this.logger.error(error);
                    throw error;
            }
        }
    }
}
