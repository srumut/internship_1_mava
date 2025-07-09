import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { v4 as uuid4 } from 'uuid';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private readonly db: DatabaseService) {}

    findAll(): Promise<{ id: string; username: string }[]> {
        return this.db.user.findMany({ select: { id: true, username: true } });
    }

    findById(id: string): Promise<{ id: string; username: string } | null> {
        return this.db.user.findUnique({
            where: { id: id },
            select: { id: true, username: true },
        });
    }

    create(dto: CreateUserDto): Promise<{ id: string; username: string }> {
        const salt = bcrypt.genSaltSync(10);
        return this.db.user.create({
            data: {
                id: uuid4(),
                username: dto.username,
                password: bcrypt.hashSync(dto.password, salt),
            },
            select: { id: true, username: true },
        });
    }

    delete(id: string): Promise<{ id: string; username: string }> {
        return this.db.user.delete({
            where: { id: id },
            select: { id: true, username: true },
        });
    }

    update(
        id: string,
        dto: UpdateUserDto,
    ): Promise<{ id: string; username: string }> {
        const data = { id, ...dto };
        if (data?.password) {
            const salt = bcrypt.genSaltSync(10);
            data.password = bcrypt.hashSync(data.password, salt);
        }
        return this.db.user.update({
            where: { id: id },
            data: data,
            select: { id: true, username: true },
        });
    }
}
