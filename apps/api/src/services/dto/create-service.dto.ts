import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from "class-validator";
import { MediaRefDto, SeoMetaDto } from "../../common/dto/embedded.dto";

export class CreateServiceDto {
  @IsString() @MinLength(1) @MaxLength(120)
  title!: string;

  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "slug must be lowercase kebab-case (e.g. ai-agents)",
  })
  @MaxLength(120)
  slug!: string;

  @IsString() @MinLength(1) @MaxLength(300)
  shortDescription!: string;

  @IsString() @MinLength(1) @MaxLength(5000)
  description!: string;

  @IsOptional() @ValidateNested() @Type(() => MediaRefDto)
  banner?: MediaRefDto;

  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => MediaRefDto)
  images?: MediaRefDto[];

  @IsOptional() @IsString() @MaxLength(60)
  icon?: string;

  @IsOptional() @IsArray() @IsString({ each: true }) @MaxLength(300, { each: true })
  highlights?: string[];

  @IsOptional() @IsInt()
  displayOrder?: number;

  @IsOptional() @IsBoolean()
  featured?: boolean;

  @IsOptional() @IsBoolean()
  published?: boolean;

  @IsOptional() @ValidateNested() @Type(() => SeoMetaDto)
  seo?: SeoMetaDto;
}
