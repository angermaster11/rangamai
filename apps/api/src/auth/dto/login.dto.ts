import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class LoginDto {
  @IsEmail({}, { message: "email must be a valid email address" })
  @MaxLength(200)
  email!: string;

  @IsString()
  @IsNotEmpty({ message: "password is required" })
  @MaxLength(200)
  password!: string;
}
