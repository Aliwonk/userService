import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {

    @ApiProperty({ example: 'Alex', description: 'Имя пользователя' })
    @Prop({ required: true })
    firstName: string

    @ApiProperty({ example: 'Mashkov', description: 'Фамилия пользователя', required: false })
    @Prop()
    lastName: string

    @ApiProperty({ example: 'test@mail.com', description: 'Логин пользователя' })
    @Prop({ required: true, unique: true })
    login: string

    @ApiProperty({ example: '+79999999999', description: 'Телефон пользователя', required: false })
    @Prop()
    phone: string

    @ApiProperty({ example: 'image.jpg', description: 'Фото пользователя', required: false })
    @Prop()
    image: string

    @ApiProperty({ example: '$2b$10$xfWRPUSQpfGDIr3XxYlnzeetjNdMYsQWc7aOmgbSgar56rAMBQaSG', description: 'Пароль пользователя' })
    @Prop( { required: true } )
    password: string
}

export const UserSchema = SchemaFactory.createForClass(User);