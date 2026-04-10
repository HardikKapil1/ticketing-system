import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtUser } from 'src/common/interfaces/jwt-user.inteface';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secretKey', // must match your JWT config
    });
  }

  async validate(payload: {
    sub?: number;
    userId?: number;
    role?: Role;
    email?: string;
  }): Promise<JwtUser & { email?: string }> {
    return {
      userId: payload.userId ?? payload.sub!,
      role: payload.role ?? Role.USER,
      email: payload.email,
    };
  }
}
