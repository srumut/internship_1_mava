import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@ApiExtraModels()
export class CreateUserDto {
    @ApiProperty({ example: 'domm' })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ example: 'malmiles' })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({ example: 'Dominick' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Cobb' })
    @IsString()
    @IsNotEmpty()
    surname: string;
}
