import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateProductDto } from './dto/create-product.dto';
import { v4 as uuid4 } from 'uuid';
import { UpdateProductDto } from './dto/update-product.dto';
import { BrandsService } from 'src/brands/brands.service';
import { OrderProductDto } from './dto/order-products.dto';

@Injectable()
export class ProductsService {
    constructor(
        private readonly db: DatabaseService,
        private readonly brandsService: BrandsService,
    ) {}

    findAll() {
        return this.db.product.findMany();
    }

    findById(id: string) {
        return this.db.product.findUnique({ where: { id: id } });
    }

    async create(dto: CreateProductDto) {
        const brand = await this.brandsService.findById(dto.brand_id);
        if (!brand) {
            throw new BadRequestException(
                `Brand with id ${dto.brand_id} was not found`,
            );
        }
        return this.db.product.create({
            data: {
                id: uuid4(),
                ...dto,
                createdAt: new Date(),
                brand_id: brand.id,
            },
        });
    }

    delete(id: string) {
        return this.db.product.delete({ where: { id: id } });
    }

    update(id: string, dto: UpdateProductDto) {
        return this.db.product.update({
            where: { id: id },
            data: { id: id, ...dto },
        });
    }

    async findAllOrders() {
        const db_orders: [
            {
                user_id: string;
                order_id: string;
                username: string;
                product_name: string;
                count: number;
                time: Date;
            },
        ] = await this.db.$queryRaw`SELECT 
            o.user_id as user_id,
            o.id as order_id,
            u.username as username,
            p.name as product_name, 
            op.count as count,
            o.createdAt as 'time'
            FROM 'order' o
        INNER JOIN order_products op ON o.id = op.order_id
        INNER JOIN product p ON op.product_id = p.id
        INNER JOIN user u ON o.user_id = u.id`;

        const users: {
            user_id: string;
            username: string;
            orders: {
                order_id: string;
                products: { product_name: string; count: number }[];
            }[];
        }[] = [];
        let order_added: boolean;
        for (let db_order of db_orders) {
            order_added = false;
            for (let user of users) {
                if (user.user_id !== db_order.user_id) continue;
                for (let user_order of user.orders) {
                    if (user_order.order_id !== db_order.order_id) continue;
                    user_order.products.push({
                        product_name: db_order.product_name,
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
                            product_name: db_order.product_name,
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
                                product_name: db_order.product_name,
                                count: db_order.count,
                            },
                        ],
                    },
                ],
            });
        }

        return users;
    }

    async findAllOrdersByUser(user_id: string) {
        const orders: [
            {
                user_id: string;
                order_id: string;
                username: string;
                product_name: string;
                count: number;
                time: Date;
            },
        ] = await this.db.$queryRaw`SELECT 
            o.user_id as user_id,
            o.id as order_id,
            u.username as username,
            p.name as product_name, 
            op.count as count,
            o.createdAt as 'time'
            FROM 'order' o
        INNER JOIN order_products op ON o.id = op.order_id
        INNER JOIN product p ON op.product_id = p.id
        INNER JOIN user u ON o.user_id = u.id
        WHERE u.id = ${user_id}`;

        const response: {
            order_id: string;
            products: { product_name: string; count: number }[];
        }[] = [];
        let order_added: boolean;
        for (let order of orders) {
            order_added = false;
            for (let r of response) {
                if (r.order_id !== order.order_id) continue;
                r.products.push({
                    product_name: order.product_name,
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
                        product_name: order.product_name,
                        count: order.count,
                    },
                ],
            });
            order_added = true;
            break;
        }

        return response;
    }

    async getOrder(user_id: string, order_id: string) {
        return this.db.$queryRaw`SELECT 
            p.name as product_name, 
            op.count as count,
            o.createdAt as 'time'
            FROM 'order' o
        INNER JOIN order_products op ON o.id = op.order_id
        INNER JOIN product p ON op.product_id = p.id
        WHERE o.id = ${order_id} AND o.user_id = ${user_id}`;
    }

    async order(user_id: string, dtos: OrderProductDto[]) {
        // NOTE(umut): it is not checking if the user exists because in order
        // to buy a product one would need the bearer token and it is checked
        // if the token subject user does exists or not

        for (let dto of dtos) {
            const product = await this.findById(dto.product_id);
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
}
