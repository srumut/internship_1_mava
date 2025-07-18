import { ApiExtraModels, PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';

@ApiExtraModels()
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
