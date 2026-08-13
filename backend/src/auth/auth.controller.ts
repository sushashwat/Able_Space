// backend/src/auth/auth.controller.ts

import { Controller, Get, Post, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './strategies/jwt.auth.guard';
import type { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('guest')
  async guestLogin() {
    return this.authService.guestLogin();
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // will redirect to google login page
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: any, @Res() res: Response) {
    const result = await this.authService.googleLogin(req.user);
    res.redirect(
      `http://localhost:3000/auth/callback?token=${result.access_token}`,
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.authService.getProfile(userId);
  }
}