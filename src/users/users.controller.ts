import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post("/")
    async create(
        @Body() createUserDto: CreateUserDto
    ): Promise<User> {
        return this.usersService.create(createUserDto);
    }

    // @Post()
    // async upsertUser(@Body() body: any) {
    //     const { name, email, phone, ...dynamicFields } = body;
    //     return this.userService.upsertUser({ name, email, phone, dynamic_data: dynamicFields });
    // }

}