import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>) { }

    create(createUserDto: CreateUserDto) {
        const { name, email, phone, ...extra_fields } = createUserDto;

        const newUser = this.usersRepository.create({
            name,
            email,
            phone,
            extra_fields,
        });

        return this.usersRepository.save(newUser);
    }
} 