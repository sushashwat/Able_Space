import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  // Guest login 
  async guestLogin() {
    const guestNumber = Math.floor(1000 + Math.random() * 9000);
    const guestUser = await this.userModel.create({
      email: `guest_${guestNumber}@ablespace.temp`,
      fullName: `Guest_${guestNumber}`,
      isGuest: true,
    });

    return this.generateToken(guestUser);
  }

  // Google login 
  async googleLogin(googleUser: {
    email: string;
    fullName: string;
    avatarUrl: string;
    googleId: string;
  }) {
    let user = await this.userModel.findOne({ email: googleUser.email });

    if (!user) {
      user = await this.userModel.create({
        email: googleUser.email,
        fullName: googleUser.fullName,
        avatarUrl: googleUser.avatarUrl,
        googleId: googleUser.googleId,
        isGuest: false,
      });
    }

    return this.generateToken(user);
  }

  //  common function
  private generateToken(user: UserDocument) {
    const payload = { sub: user._id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        isGuest: user.isGuest,
      },
    };
  }
}