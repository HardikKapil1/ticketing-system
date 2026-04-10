import { Body, Controller, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto, RegisterDto } from './user.dto';
import { ApiBody } from '@nestjs/swagger';
import type { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiBody({ type: RegisterDto })
  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.userService.register(body.email, body.password);
  }
  @ApiBody({ type: LoginDto })
  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const tokens = await this.userService.login(body.email, body.password)
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days in ms
    })

    return res.json({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token
    })
  }
}
