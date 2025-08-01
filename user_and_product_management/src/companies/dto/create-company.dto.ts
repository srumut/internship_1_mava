import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@ApiExtraModels()
export class CreateCompanyDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
}
