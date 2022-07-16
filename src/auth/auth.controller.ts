import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import CreateUserDto from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({ summary: 'Вход пользователя' })
    @Post('login')
    login(@Body() userData: LoginUserDto) {
        return this.authService.login(userData);
    }

    @ApiOperation({ summary: 'Регистрация пользователя' })
    @ApiBody({ type: CreateUserDto })
    @Post('register')
    registration(@Body() userData: CreateUserDto, image: Express.Multer.File) {
        return this.authService.registration(userData, image);
    }
}
