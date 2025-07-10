import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels()
export class UpdateUserDto extends PartialType(CreateUserDto) {}
