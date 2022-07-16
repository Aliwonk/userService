import { Body, Controller, Delete, Get, HttpCode, Inject, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import CreateUserDto from './dto/create-user.dto';
import { User } from './schemas/User.schema';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(
        private userService: UserService
    ) {}

    @ApiOperation({ summary: 'Создание пользоваетеля' })
    @ApiResponse({ status: 201, type: User })
    @HttpCode(201)
    @Post('create')
    @UseInterceptors(FileInterceptor('image'))
    registerUser(@Body() userData: CreateUserDto, @UploadedFile() image: Express.Multer.File) {
        return this.userService.createUser(userData, image);
    }

    @ApiOperation({ summary: 'Обновление данных пользовтеля' })
    @ApiResponse({ status: 200, type: User })
    @HttpCode(200)
    @Post('update/:id')
    updateUser(@Param('id') id: ObjectId, @Body() userData: CreateUserDto, @UploadedFile() image: Express.Multer.File) {
        return this.userService.updateUser(id, userData, image);
    }
    
    @ApiOperation({ summary: 'Получение одного пользователя' })
    @ApiResponse({ status: 200, type: User })
    @ApiParam({
        name: 'id',
        required: true
    })
    @HttpCode(200)
    @Get(':id')
    getOneUser(@Param('id') id: ObjectId) {
        return this.userService.getUserById(id);
    }
    

    @ApiOperation({ summary: 'Получение всех пользователей' })
    @ApiOkResponse({ type: [User] })
    @HttpCode(200)
    @Get('')
    getAllUsers() {
        return this.userService.getUsers();
    }

    @ApiOperation({ summary: 'Удаление пользователя по id' })
    @ApiOkResponse()
    @HttpCode(200)
    @ApiParam({
        name: 'id',
        required: true
    })
    @Delete('delete/:id')
    deleteUser(@Param('id') id: ObjectId) {
        return this.userService.deleteUser(id)
    }


}
