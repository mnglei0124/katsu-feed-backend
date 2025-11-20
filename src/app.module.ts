import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [AuthModule, UsersModule, PostsModule, CommentsModule, NotificationsModule, SupabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
