// src/dto/user.dto.ts
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    IsInt,
    MaxLength,
} from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    username: string;

    @IsEmail()
    @IsNotEmpty()
    @MaxLength(150)
    email: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    password: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    first_name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    last_name: string;

    @IsOptional()
    @IsString()
    @MaxLength(150)
    @IsUrl()
    avatar?: string | undefined;

    @IsInt()
    role_id: number;
}

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    username?: string;

    @IsOptional()
    @IsEmail()
    @MaxLength(150)
    email?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    password?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    first_name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    last_name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(150)
    @IsUrl()
    avatar?: string | undefined;

    @IsOptional()
    @IsInt()
    role_id?: number;
}
