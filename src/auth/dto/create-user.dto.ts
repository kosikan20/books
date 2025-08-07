import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  firstname: string;

  @IsString()
  @MinLength(3)
  lastname: string;

  @IsString()
  @MinLength(3)
  username: string;

  password: string;
}
