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

class ProjectMetricDto {
  @IsString() @MaxLength(80) label!: string;
  @IsString() @MaxLength(120) value!: string;
}

export class CreateProjectDto {
  @IsString() @MinLength(1) @MaxLength(140)
  title!: string;

  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "slug must be lowercase kebab-case (e.g. mecfinders)",
  })
  @MaxLength(140)
  slug!: string;

  @IsString() @MinLength(1) @MaxLength(300)
  shortDescription!: string;

  @IsOptional() @ValidateNested() @Type(() => MediaRefDto)
  coverImage?: MediaRefDto;

  @IsString() @MinLength(1) @MaxLength(8000)
  description!: string;

  @IsOptional() @IsString() @MaxLength(4000)
  problem?: string;

  @IsOptional() @IsString() @MaxLength(4000)
  solution?: string;

  @IsOptional() @IsArray() @IsString({ each: true }) @MaxLength(300, { each: true })
  keyFeatures?: string[];

  @IsOptional() @IsArray() @IsString({ each: true }) @MaxLength(60, { each: true })
  techStack?: string[];

  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => ProjectMetricDto)
  metrics?: ProjectMetricDto[];

  @IsOptional() @IsString() @MaxLength(140)
  client?: string;

  @IsOptional() @IsString() @MaxLength(120)
  industry?: string;

  @IsOptional() @IsArray() @IsString({ each: true }) @MaxLength(140, { each: true })
  servicesUsed?: string[];

  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => MediaRefDto)
  gallery?: MediaRefDto[];

  @IsOptional() @IsString() @MaxLength(500)
  liveUrl?: string;

  @IsOptional() @IsString() @MaxLength(500)
  githubUrl?: string;

  @IsOptional() @IsInt()
  displayOrder?: number;

  @IsOptional() @IsBoolean()
  featured?: boolean;

  @IsOptional() @IsBoolean()
  published?: boolean;

  @IsOptional() @ValidateNested() @Type(() => SeoMetaDto)
  seo?: SeoMetaDto;
}
