import { ApiProperty } from "@nestjs/swagger"

export default class CreateUserDto {
    
    @ApiProperty({ example: 'Alex', description: 'Имя пользователя', required: true })
    readonly firstName: string
    
    @ApiProperty({ example: 'Mashkov', description: 'Фамилия пользователя', required: false })
    readonly lastName: string
    
    @ApiProperty({ example: 'test@mail.com', description: 'Логин пользователя'})
    readonly login: string

    @ApiProperty({ example: '+79999999999', description: 'Телефон пользователя', required: false })
    readonly phone: string

    @ApiProperty({ example: 'test123', description: 'Пароль пользователя', required: true })
    readonly password: string

    @ApiProperty({ example: '1s', description: 'Продолжительность токена' })
    readonly expiresIn: string | number
}