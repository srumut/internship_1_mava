import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBranchDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    company_id: string;
}
