import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { v4 as uuid4 } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        await this.$connect();

        const admins = await this.admin.findMany();
        if (admins.length === 0) {
            const salt = bcrypt.genSaltSync(10);
            const password = process.env.DEFAULT_ADMIN_PASSWORD ?? 'admin123';
            await this.admin.create({
                data: {
                    id: uuid4(),
                    username: process.env.DEFAULT_ADMIN_USERNAME ?? 'admin',
                    password: bcrypt.hashSync(password, salt),
                    createdAt: new Date(),
                },
            });
        }
    }
}
