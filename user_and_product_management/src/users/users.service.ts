import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { v4 as uuid4 } from 'uuid';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private readonly db: DatabaseService) {}

    findAll(omit: {
        id?: true;
        username?: true;
        name?: true;
        surname?: true;
        profession?: true;
        createdAt?: true;
        updatedAt?: true;
    }) {
        return this.db.user.findMany({
            omit: { password: true, ...omit },
        });
    }

    findById(id: string) {
        return this.db.user.findUnique({
            where: { id: id },
            omit: { password: true },
        });
    }

    create(dto: CreateUserDto) {
        const salt = bcrypt.genSaltSync(10);
        return this.db.user.create({
            data: {
                ...dto,
                id: uuid4(),
                password: bcrypt.hashSync(dto.password, salt),
                createdAt: new Date(),
            },
            omit: { password: true },
        });
    }

    delete(id: string, omit?: { id?: true }) {
        return this.db.user.delete({
            where: { id: id },
            omit: { password: true, ...omit },
        });
    }

    update(id: string, dto: UpdateUserDto, omit?: { id?: true }) {
        const data = { id, ...dto };
        if (data?.password) {
            const salt = bcrypt.genSaltSync(10);
            data.password = bcrypt.hashSync(data.password, salt);
        }
        return this.db.user.update({
            where: { id: id },
            data: data,
            omit: { password: true, ...omit },
        });
    }

    findByUsername(
        username: string,
        select?: {
            id?: true;
            username?: true;
            password?: true;
            name?: true;
            surname?: true;
            profession?: true;
            createdAt?: true;
            updatedAt?: true;
        },
    ) {
        return this.db.user.findUnique({
            where: { username: username },
            select,
        });
    }
}
