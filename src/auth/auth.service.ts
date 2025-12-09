import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async register(dto: RegisterDto) {
    const { email, password, username } = dto;
    const { data, error } = await this.supabaseService.supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }
    return { user: data.user, message: 'User registered successfully. Please check your email for verification.' };
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;
    const { data, error } = await this.supabaseService.supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }
    return { 
      access_token: data.session?.access_token, 
      refresh_token: data.session?.refresh_token,
      user: data.user 
    };
  }
}
