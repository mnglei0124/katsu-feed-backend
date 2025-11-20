import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { SupabaseService } from '../supabase/supabase.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class PostsService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const { data, error } = await this.supabaseService.supabaseClient
      .from('posts')
      .insert([createPostDto])
      .select('*, author:profiles(*)')
      .single();

    if (error) {
      throw new NotFoundException(error.message);
    }
    return data;
  }

  async findAll() {
    const { data, error } = await this.supabaseService.supabaseClient
      .from('posts')
      .select('*, author:profiles(*)')
      .order('created_at', { ascending: false });

    if (error) {
      throw new NotFoundException(error.message);
    }
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabaseService.supabaseClient
      .from('posts')
      .select('*, author:profiles(*)')
      .eq('id', id)
      .single();

    if (error) {
      throw new NotFoundException(error.message);
    }
    return data;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const { data, error } = await this.supabaseService.supabaseClient
      .from('posts')
      .update(updatePostDto)
      .eq('id', id)
      .select('*, author:profiles(*)')
      .single();

    if (error) {
      throw new NotFoundException(error.message);
    }
    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabaseService.supabaseClient
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      throw new NotFoundException(error.message);
    }
    return { id, message: `Post ${id} removed successfully` };
  }

  async likePost(postId: string, userId: string) {
    // TODO: Implement actual like logic (e.g., insert into a 'likes' table)
    // For now, we'll just simulate a like and emit a WebSocket event.
    console.log(`User ${userId} liked post ${postId}`);
    this.notificationsGateway.server.emit('postLiked', { postId, userId, likes: 1 });
    return { message: 'Post liked successfully' };
  }
}
