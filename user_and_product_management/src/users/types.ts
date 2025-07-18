import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

@ApiExtraModels()
export class Product {
    @ApiProperty()
    product_id: string;

    @ApiProperty()
    product_name: string;

    @ApiProperty()
    count: number;

    @ApiProperty()
    brand: string;

    @ApiProperty()
    category_id: string;
}

@ApiExtraModels()
export class Order {
    @ApiProperty()
    order_id: string;

    @ApiProperty({ type: [Product] })
    products: Product[];
}

@ApiExtraModels()
export class UserOrder {
    @ApiProperty()
    user_id: string;

    @ApiProperty()
    username: string;

    @ApiProperty({ type: [Order] })
    orders: Order[];
}
