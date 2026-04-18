import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto, RegisterDto } from './user.dto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBody({ type: RegisterDto })
  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.userService.register(body.email, body.password);
  }
  @ApiBody({ type: LoginDto })
  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const tokens = await this.userService.login(body.email, body.password);
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
    });

    return res.json({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    });
  }
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @Get('all')
  async findAll() {
    return this.userService.findAll();
  }
}
