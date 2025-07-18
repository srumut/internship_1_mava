import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category.dto';

@ApiExtraModels()
export class Category extends CreateCategoryDto {
    @ApiProperty()
    id: string;
}
