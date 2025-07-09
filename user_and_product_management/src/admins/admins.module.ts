import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    providers: [AdminsService],
    controllers: [AdminsController],
    imports: [DatabaseModule],
    exports: [AdminsService],
})
export class AdminsModule {}
