import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

@ApiExtraModels()
export class ProductRespDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    stock: number;

    @ApiProperty()
    category_id: string;

    @ApiProperty()
    category: string;

    @ApiProperty()
    category_description: string;

    @ApiProperty()
    branch_id: string;

    @ApiProperty()
    branch: string;

    @ApiProperty()
    company_id: string;

    @ApiProperty()
    company: string;
}
