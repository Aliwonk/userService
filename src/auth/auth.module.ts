import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { FileService } from 'src/file/file.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_KEY || 'secret',
      signOptions: {
        expiresIn: '900s'
      }
    }),
    UserModule
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
