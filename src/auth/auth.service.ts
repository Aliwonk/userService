import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt'; 
import CreateUserDto from 'src/user/dto/create-user.dto';
import { User, UserDocument } from 'src/user/schemas/User.schema';
import { UserService } from 'src/user/user.service';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    private validateData(data: LoginUserDto) {
        const { login, password } = data;

        // Checking data for emptiness
        if(login === '') return 'Empty login';
        if(password === '') return 'Empty password';

        // validate value login

        const emailRegexp = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
        const validateLogin = emailRegexp.test(login);
        if(!validateLogin) return 'Incorrect login';

        // validate password

        if(password.length < 4) return 'Short password';

        return null;
    }

    private generateToken(userData: UserDocument | any, expiresIn?: number) {
        const payload = {login: userData.login, id: userData._id}
        if(expiresIn) return { access_token: this.jwtService.sign(payload, { expiresIn }) }
        return { access_token: this.jwtService.sign(payload) }
    }


    async login(userData: LoginUserDto) {

        const validate = this.validateData(userData);
        if(validate) return new BadRequestException(validate);

        // get user from dataBase
        
        const user = await this.userService.getUserByEmail(userData.login);

        if(!user) return new HttpException({error: 'User not found'}, 404);
        
        // check password

        const passwordDB = user.password;
        const password = userData.password;
        const checkPassword = await bcrypt.compare(password, passwordDB);

        if(!checkPassword) return new HttpException({ error: 'Incorrect password or email' }, 400)

        return this.generateToken(user);

    }


    async registration(userData: CreateUserDto, image: Express.Multer.File) {
        const user = this.userService.createUser(userData, image)
        return this.generateToken(user);
    }



}
