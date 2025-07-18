import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { AdminsModule } from './admins/admins.module';
import { BrandsModule } from './brands/brands.module';
import { LoggerMiddleware } from './logger.middleware';
import { CategoriesModule } from './categories/categories.module';

@Module({
    imports: [
        UsersModule,
        ProductsModule,
        DatabaseModule,
        AuthModule,
        AdminsModule,
        BrandsModule,
        CategoriesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
