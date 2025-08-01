import { ApiExtraModels, PartialType } from '@nestjs/swagger';
import { CreateCompanyDto } from './create-company.dto';

@ApiExtraModels()
export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}
