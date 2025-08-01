import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

@ApiExtraModels()
export class CreateProductDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string;

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
    branch_id: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    category_id: string;
}
