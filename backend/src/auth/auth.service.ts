import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  generateToken(user: any) {
    const payload = {
      userId: user.id,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_SECRET,
    });

    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: '30d',
      secret: process.env.JWT_REFRESH_SECRET,
    });

    return { access_token, refresh_token };
  }
  /**
   * Refreshes the access token using the provided refresh token
   * @param token
   * @returns
   */
  refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const newPayload = { userId: payload.userId, role: payload.role };

      return {
        access_token: this.jwtService.sign(newPayload, {
          expiresIn: '15m',
          secret: process.env.JWT_SECRET,
        }),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
