import { ApiExtraModels, PartialType } from '@nestjs/swagger';
import { CreateBrandDto } from './create-brand.dto';

@ApiExtraModels()
export class UpdateBrandDto extends PartialType(CreateBrandDto) {}
