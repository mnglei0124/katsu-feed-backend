import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [NotificationsModule, SupabaseModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
