import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [NotificationsModule, SupabaseModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
