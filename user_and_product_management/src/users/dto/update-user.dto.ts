import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels()
export class UpdateUserDto extends PartialType(CreateUserDto) {}
