import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@ApiExtraModels()
export class UserLoginDto {
    @ApiProperty({ example: 'testuser' })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ example: 'secretpassword' })
    @IsString()
    @IsNotEmpty()
    password: string;
}
