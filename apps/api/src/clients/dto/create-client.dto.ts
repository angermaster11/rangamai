import { Type } from "class-transformer";
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from "class-validator";
import { MediaRefDto } from "../../common/dto/embedded.dto";

export class CreateClientDto {
  @IsString() @MinLength(1) @MaxLength(140)
  companyName!: string;

  @IsOptional() @ValidateNested() @Type(() => MediaRefDto)
  logo?: MediaRefDto;

  @IsOptional() @IsString() @MaxLength(500)
  website?: string;

  @IsOptional() @IsString() @MaxLength(120)
  industry?: string;

  @IsOptional() @IsString() @MaxLength(500)
  description?: string;

  @IsOptional() @IsBoolean()
  showPublicly?: boolean;

  @IsOptional() @IsInt()
  displayOrder?: number;
}
