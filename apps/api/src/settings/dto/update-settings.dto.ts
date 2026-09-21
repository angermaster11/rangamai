import { Type } from "class-transformer";
import {
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import { SeoMetaDto } from "../../common/dto/embedded.dto";

class ContactLinkDto {
  @IsString() @MaxLength(40) kind!: string;
  @IsString() @MaxLength(80) label!: string;
  @IsString() @MaxLength(500) href!: string;
}

/** Admin update of site-wide settings. All fields optional (PATCH-style). */
export class UpdateSettingsDto {
  @IsOptional() @IsString() @MaxLength(140)
  companyName?: string;

  @IsOptional() @IsString() @MaxLength(300)
  tagline?: string;

  @IsOptional() @IsString() @MaxLength(200)
  email?: string;

  @IsOptional() @IsString() @MaxLength(40)
  phone?: string;

  @IsOptional() @IsString() @MaxLength(40)
  whatsapp?: string;

  @IsOptional() @IsString() @MaxLength(300)
  address?: string;

  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => ContactLinkDto)
  socialLinks?: ContactLinkDto[];

  @IsOptional() @ValidateNested() @Type(() => SeoMetaDto)
  seo?: SeoMetaDto;
}
