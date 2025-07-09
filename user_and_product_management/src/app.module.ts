import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { AdminsModule } from './admins/admins.module';

@Module({
    imports: [UsersModule, ProductsModule, DatabaseModule, AuthModule, AdminsModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
