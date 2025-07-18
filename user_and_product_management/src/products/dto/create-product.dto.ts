import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsInt()
    @Min(0)
    stock: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    brand_id: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    category_id: string;
}
