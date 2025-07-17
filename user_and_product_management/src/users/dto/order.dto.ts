import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

@ApiExtraModels()
export class OrderProductDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    product_id: string;

    @ApiProperty()
    @IsInt()
    @IsPositive()
    count: number;
}
