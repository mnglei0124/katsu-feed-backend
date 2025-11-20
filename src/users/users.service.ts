import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { SupabaseService } from '../supabase/supabase.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class UsersService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async findOne(id: string) {
    const { data, error } = await this.supabaseService.supabaseClient
      .from('profiles') // Assuming 'profiles' is your user table in Supabase
      .select('id, email, username, avatar_url')
      .eq('id', id)
      .single();

    if (error) {
      throw new NotFoundException(error.message);
    }
    return data;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { data, error } = await this.supabaseService.supabaseClient
      .from('profiles')
      .update({ username: updateUserDto.username, avatar_url: updateUserDto.avatarUrl })
      .eq('id', id)
      .select('id, email, username, avatar_url')
      .single();

    if (error) {
      throw new NotFoundException(error.message);
    }
    return data;
  }

  async findPostsByUserId(userId: string) {
    const { data, error } = await this.supabaseService.supabaseClient
      .from('posts')
      .select('*, author:profiles(*)') // Assuming 'posts' is your posts table and 'profiles' is linked
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new NotFoundException(error.message);
    }
    return data;
  }

  async followUser(followerId: string, followedId: string) {
    // TODO: Implement actual follow logic (e.g., insert into a 'follows' table)
    // For now, we'll just simulate a follow and emit a WebSocket event.
    console.log(`User ${followerId} followed user ${followedId}`);
    this.notificationsGateway.server.emit('userFollowed', { followerId, followedId });
    return { message: 'User followed successfully' };
  }
}
