import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly supabaseService: SupabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: async (request, rawJwtToken, done) => {
        try {
          // You might need to fetch the public key from Supabase's /.well-known/jwks.json endpoint
          // For simplicity, we'll use a placeholder secret, but this should be dynamic in production
          const secret = process.env.SUPABASE_JWT_SECRET || 'YOUR_SUPABASE_JWT_SECRET';
          done(null, secret);
        } catch (error) {
          done(error, null);
        }
      },
    });
  }

  async validate(payload: any) {
    // You can fetch user details from Supabase here if needed
    return { userId: payload.sub, email: payload.email };
  }
}
