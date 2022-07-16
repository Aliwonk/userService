import { BadGatewayException, BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, ObjectId } from 'mongoose';
import { FileService } from 'src/file/file.service';
import CreateUserDto from './dto/create-user.dto';
import { User, UserDocument } from './schemas/User.schema';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private fileService: FileService
    ) {}

    // validate data user 

    private validateData(data: CreateUserDto) {
        const { firstName, login, password } = data;

        // Checking data for emptiness

        if(firstName === '') return 'Empty firstname';
        if(login === '') return 'Empty login';
        if(password === '') return 'Empty password';

        // validate value login

        const emailRegexp = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
        const validateLogin = emailRegexp.test(login);
        if(!validateLogin) return 'Incorrect login';

        // validate password

        if(password.length < 4) return 'Short password';

        // check file pohoto

        return null;

    }

    async createUser(userData: CreateUserDto, image: Express.Multer.File): Promise<UserDocument | BadRequestException> {
        const validateData = this.validateData(userData);

        // send error incorrect data user

        if(validateData) return new BadRequestException(validateData);

        // сhecking if a user exists

        const user = await this.userModel.findOne({ login: userData.login });
        if(user) {

            // delete file image from upload

            this.fileService.removeImage({ image });
        
            // send error: user exists

            return new BadRequestException('User exists');
        
        }

        // save image user
        let fileName;
        if(image) {
            fileName = this.fileService.saveImage(image);
        }

        // save user

        // hashing password

        const salt = await bcrypt.genSalt()
        const hashPassword = bcrypt.hashSync(userData.password, salt);

        const createdUser = new this.userModel({...userData, image: fileName, password: hashPassword});
        return createdUser.save();
    }

    async updateUser(id: ObjectId, userData: CreateUserDto, image: Express.Multer.File): Promise<UserDocument | NotFoundException> {
        
        try {

            if(image) {
                    
                const updateImage = this.fileService.saveImage(image);
                const updateData = await this.userModel.findByIdAndUpdate(id, { ...userData, image: updateImage });
                return updateData;
        
            }

            const updateData = await this.userModel.findByIdAndUpdate(id, userData);
            return updateData;
            
        } catch (error) {

            return new NotFoundException('User not found');

        }
    }

    async getUsers(): Promise<UserDocument[]> {
        return this.userModel.find();
    }

    async getUserById(id: ObjectId): Promise<UserDocument | NotFoundException> {
        try {
            const user = await this.userModel.findById(id);
            return user;
        } catch (err) {
            return new NotFoundException('User not found');
        }
    }


    async getUserByEmail(login: string): Promise<UserDocument> {

            const user = await this.userModel.findOne({login: login});
            return user;
    }

    async deleteUser(id: ObjectId) {
        
        this.fileService.removeImage({ id })
        const delUser = await this.userModel.findByIdAndDelete(id);
        
        if(!delUser) return new NotFoundException('User not found');
        return { message: 'Delete successfuly' };
    }
}
