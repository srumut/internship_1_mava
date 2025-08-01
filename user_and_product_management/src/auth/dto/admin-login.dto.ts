import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@ApiExtraModels()
export class AdminLoginDto {
    @ApiProperty({ example: 'admin' })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ example: 'admin123' })
    @IsString()
    @IsNotEmpty()
    password: string;
}
