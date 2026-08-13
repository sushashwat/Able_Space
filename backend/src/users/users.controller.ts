import { Controller, Patch, Body, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/strategies/jwt.auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Patch('me')
  async updateProfile(@Req() req: Request, @Body() body: any) {
    const userId = (req.user as any).userId;
    return this.usersService.updateProfile(userId, body);
  }
}