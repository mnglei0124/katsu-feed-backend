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
      .select('*, profiles!user_id(*)')
      .single();

    if (error) {
      throw new NotFoundException(error.message);
    }
    
    const comment = { ...data, author: data.profiles, profiles: undefined };
    this.notificationsGateway.server.emit('newComment', comment); // Emit WebSocket event
    return comment;
  }

  async findAllByPostId(postId: string) {
    const { data, error } = await this.supabaseService.supabaseClient
      .from('comments')
      .select('*, profiles!user_id(*)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new NotFoundException(error.message);
    }
    
    return data.map((comment: any) => ({
      ...comment,
      author: comment.profiles,
      profiles: undefined
    }));
  }

  async findOne(id: string) {
    const { data, error } = await this.supabaseService.supabaseClient
      .from('comments')
      .select('*, profiles!user_id(*)')
      .eq('id', id)
      .single();

    if (error) {
      throw new NotFoundException(error.message);
    }
    
    return { ...data, author: data.profiles, profiles: undefined };
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    const { data, error } = await this.supabaseService.supabaseClient
      .from('comments')
      .update(updateCommentDto)
      .eq('id', id)
      .select('*, profiles!user_id(*)')
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
