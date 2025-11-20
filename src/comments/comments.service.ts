import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { SupabaseService } from '../supabase/supabase.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class CommentsService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const { data, error } = await this.supabaseService.supabaseClient
      .from('comments')
      .insert([createCommentDto])
      .select('*, author:profiles(*)')
      .single();

    if (error) {
      throw new NotFoundException(error.message);
    }
    this.notificationsGateway.server.emit('newComment', data); // Emit WebSocket event
    return data;
  }

  async findAllByPostId(postId: string) {
    const { data, error } = await this.supabaseService.supabaseClient
      .from('comments')
      .select('*, author:profiles(*)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new NotFoundException(error.message);
    }
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabaseService.supabaseClient
      .from('comments')
      .select('*, author:profiles(*)')
      .eq('id', id)
      .single();

    if (error) {
      throw new NotFoundException(error.message);
    }
    return data;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    const { data, error } = await this.supabaseService.supabaseClient
      .from('comments')
      .update(updateCommentDto)
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
      .from('comments')
      .delete()
      .eq('id', id);

    if (error) {
      throw new NotFoundException(error.message);
    }
    return { id, message: `Comment ${id} removed successfully` };
  }
}
