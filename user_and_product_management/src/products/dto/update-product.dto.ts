import { ApiExtraModels, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

@ApiExtraModels()
export class UpdateProductDto extends PartialType(CreateProductDto) {}
