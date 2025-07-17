import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { v4 as uuid4 } from 'uuid';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { OrderProductDto } from './dto/order.dto';
import { Order, UserOrder } from './types';

@Injectable()
export class UsersService {
    constructor(private readonly db: DatabaseService) {}

    findAll() {
        return this.db.user.findMany({
            omit: { password: true },
        });
    }

    findById(id: string) {
        return this.db.user.findUnique({
            where: { id: id },
            omit: { password: true },
        });
    }

    create(dto: CreateUserDto) {
        const salt = bcrypt.genSaltSync(10);
        return this.db.user.create({
            data: {
                ...dto,
                id: uuid4(),
                password: bcrypt.hashSync(dto.password, salt),
                createdAt: new Date(),
            },
            omit: { password: true, id: true, updatedAt: true },
        });
    }

    delete(id: string, omit?: { id: true }) {
        return this.db.user.delete({
            where: { id: id },
            omit: { password: true, ...omit },
        });
    }

    update(id: string, dto: UpdateUserDto, omit?: { id: true }) {
        const data = { id, ...dto };
        if (data?.password) {
            const salt = bcrypt.genSaltSync(10);
            data.password = bcrypt.hashSync(data.password, salt);
        }
        return this.db.user.update({
            where: { id: id },
            data: data,
            omit: { password: true, ...omit },
        });
    }

    findByUsername(
        username: string,
        select?: {
            id?: true;
            username?: true;
            password?: true;
            name?: true;
            surname?: true;
            profession?: true;
            createdAt?: true;
            updatedAt?: true;
        },
    ) {
        return this.db.user.findUnique({
            where: { username: username },
            select,
        });
    }

    async findAllOrders() {
        const db_orders: [
            {
                user_id: string;
                order_id: string;
                username: string;
                product_name: string;
                product_id: string;
                brand: string;
                count: number;
                time: Date;
            },
        ] = await this.db.$queryRaw`SELECT 
            o.user_id as user_id,
            o.id as order_id,
            u.username as username,
            p.name as product_name, 
            p.id as product_id,
            b.name as brand,
            op.count as count,
            o.createdAt as 'time'
            FROM 'order' o
        INNER JOIN order_products op ON o.id = op.order_id
        INNER JOIN product p ON op.product_id = p.id
        INNER JOIN brand b ON p.brand_id = b.id
        INNER JOIN user u ON o.user_id = u.id`;

        const users: UserOrder[] = [];
        let order_added: boolean;
        for (let db_order of db_orders) {
            order_added = false;
            for (let user of users) {
                if (user.user_id !== db_order.user_id) continue;
                for (let user_order of user.orders) {
                    if (user_order.order_id !== db_order.order_id) continue;
                    user_order.products.push({
                        product_id: db_order.product_id,
                        product_name: db_order.product_name,
                        brand: db_order.brand,
                        count: db_order.count,
                    });
                    order_added = true;
                    break;
                }
                if (order_added) break;
                // if order is not yet added to users order list
                user.orders.push({
                    order_id: db_order.order_id,
                    products: [
                        {
                            product_id: db_order.product_id,
                            product_name: db_order.product_name,
                            brand: db_order.brand,
                            count: db_order.count,
                        },
                    ],
                });
                order_added = true;
                break;
            }
            if (order_added) continue;
            // if user is not yet added to response
            users.push({
                user_id: db_order.user_id,
                username: db_order.username,
                orders: [
                    {
                        order_id: db_order.order_id,
                        products: [
                            {
                                product_id: db_order.product_id,
                                product_name: db_order.product_name,
                                brand: db_order.brand,
                                count: db_order.count,
                            },
                        ],
                    },
                ],
            });
        }

        return users;
    }

    async findAllOrdersByUser(username: string) {
        const orders: [
            {
                order_id: string;
                product_id: string;
                product_name: string;
                brand: string;
                count: number;
                time: Date;
            },
        ] = await this.db.$queryRaw`SELECT 
            o.id as order_id,
            p.name as product_name, 
            p.id as product_id,
            b.name as brand,
            op.count as count,
            o.createdAt as 'time'
            FROM 'order' o
        INNER JOIN order_products op ON o.id = op.order_id
        INNER JOIN product p ON op.product_id = p.id
        INNER JOIN user u ON o.user_id = u.id
        INNER JOIN brand b ON p.brand_id = b.id
        WHERE u.username = ${username}`;

        const response: Order[] = [];
        let order_added: boolean;
        for (let order of orders) {
            order_added = false;
            for (let r of response) {
                if (r.order_id !== order.order_id) continue;
                r.products.push({
                    product_id: order.product_id,
                    product_name: order.product_name,
                    brand: order.brand,
                    count: order.count,
                });
                order_added = true;
                break;
            }
            if (order_added) continue;
            // if order is not yet added to users order list
            response.push({
                order_id: order.order_id,
                products: [
                    {
                        product_id: order.product_id,
                        product_name: order.product_name,
                        brand: order.brand,
                        count: order.count,
                    },
                ],
            });
            order_added = true;
        }

        return response;
    }

    async getOrder(user_id: string, order_id: string) {
        return this.db.$queryRaw`SELECT 
            p.name as product_name, 
            p.id as product_id,
            op.count as count,
            b.name as brand,
            o.createdAt as 'time'
            FROM 'order' o
        INNER JOIN order_products op ON o.id = op.order_id
        INNER JOIN product p ON op.product_id = p.id
        INNER JOIN brand b ON p.brand_id = b.id
        WHERE o.id = ${order_id} AND o.user_id = ${user_id}`;
    }

    async order(user_id: string, dtos: OrderProductDto[]) {
        // NOTE(umut): it is not checking if the user exists because in order
        // to buy a product one would need the bearer token and it is checked
        // if the token subject user does exists or not

        for (let dto of dtos) {
            const product = await this.db.product.findUnique({
                where: { id: dto.product_id },
            });
            if (!product) {
                throw new NotFoundException(
                    `No product with the id ${dto.product_id} was found`,
                );
            } else if (product.stock < dto.count) {
                throw new BadRequestException(
                    `Product with id ${dto.product_id} has not enough stock`,
                );
            }
        }

        const order_id = uuid4();
        await this.db.order.create({
            data: {
                id: order_id,
                user_id: user_id,
            },
        });

        for (let dto of dtos) {
            await this.db.product.update({
                where: { id: dto.product_id },
                data: { stock: { decrement: dto.count } },
            });

            await this.db.orderProducts.create({
                data: {
                    order_id: order_id,
                    product_id: dto.product_id,
                    count: dto.count,
                },
            });
        }

        return await this.getOrder(user_id, order_id);
    }

    /** Delete order and increment the stock of every product in the order by the count it was ordered */
    async deleteOrder(order_id: string) {
        const order_products: {
            order_id: string;
            product_id: string;
            count: number;
        }[] = await this.db.orderProducts.findMany({ where: { order_id } });
        for (let order_product of order_products) {
            await this.db.product.update({
                where: { id: order_product.product_id },
                data: { stock: { increment: order_product.count } },
            });
        }
        if (order_products.length > 0) {
            await this.db.orderProducts.deleteMany({
                where: { order_id: order_id },
            });
        }
        return await this.db.order.delete({
            where: { id: order_id },
            omit: { user_id: true },
        });
    }
}
