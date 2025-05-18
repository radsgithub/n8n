// create-user.dto.ts
export class CreateUserDto {

    name: string;
    email: string;
    phone: string;

    [key: string]: any// allow extra fields
}
