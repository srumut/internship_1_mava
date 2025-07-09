import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { v4 as uuid4 } from 'uuid';
import { UpdateAdminDto } from './dto/update-admin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminsService {
    constructor(private readonly db: DatabaseService) {}

    findAll() {
        return this.db.admin.findMany({ select: { id: true, username: true } });
    }

    findById(id: string): Promise<{ id: string; username: string } | null> {
        return this.db.admin.findUnique({
            where: { id: id },
            select: { id: true, username: true },
        });
    }

    create(dto: CreateAdminDto): Promise<{ id: string; username: string }> {
        const salt = bcrypt.genSaltSync(10);
        return this.db.admin.create({
            data: {
                id: uuid4(),
                password: bcrypt.hashSync(dto.password, salt),
                username: dto.username,
            },
            select: { id: true, username: true },
        });
    }

    delete(id: string): Promise<{ id: string; username: string }> {
        return this.db.admin.delete({
            where: { id: id },
            select: { id: true, username: true },
        });
    }

    update(
        id: string,
        dto: UpdateAdminDto,
    ): Promise<{ id: string; username: string }> {
        const data = { id: id, ...dto };
        if (data?.password) {
            const salt = bcrypt.genSaltSync(10);
            data.password = bcrypt.hashSync(data.password, salt);
        }
        return this.db.admin.update({
            where: { id: id },
            data: data,
            select: { id: true, username: true },
        });
    }

    findByUsername(
        username: string,
    ): Promise<{ id: string; username: string; password: string } | null> {
        return this.db.admin.findUnique({ where: { username: username } });
    }
}
