import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from 'src/auth/auth.module';
import { FileService } from 'src/file/file.service';
import { User, UserSchema } from './schemas/User.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: User.name,
      schema: UserSchema
    }]),
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: 'upload'
      })
    }),
  ],
  controllers: [UserController],
  providers: [UserService, FileService],
  exports: [UserService]
})
export class UserModule {}
