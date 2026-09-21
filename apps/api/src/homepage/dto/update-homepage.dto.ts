import { Type } from "class-transformer";
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from "class-validator";
import { CtaDto, MediaRefDto } from "../../common/dto/embedded.dto";

class ValuePropDto {
  @IsString() @MaxLength(140) title!: string;
  @IsString() @MaxLength(600) description!: string;
  @IsOptional() @IsString() @MaxLength(60) icon?: string;
}

class ProcessStepDto {
  @IsInt() step!: number;
  @IsString() @MaxLength(80) title!: string;
  @IsString() @MaxLength(600) description!: string;
  @IsOptional() @IsString() @MaxLength(60) icon?: string;
}

/** Admin update of homepage CMS content. All fields optional (PATCH-style). */
export class UpdateHomepageDto {
  @IsOptional() @IsString() @MinLength(1) @MaxLength(200)
  heroHeading?: string;

  @IsOptional() @IsString() @MinLength(1) @MaxLength(600)
  heroSubheading?: string;

  @IsOptional() @ValidateNested() @Type(() => CtaDto)
  heroPrimaryCta?: CtaDto;

  @IsOptional() @ValidateNested() @Type(() => CtaDto)
  heroSecondaryCta?: CtaDto;

  @IsOptional() @ValidateNested() @Type(() => MediaRefDto)
  heroImage?: MediaRefDto;

  @IsOptional() @IsArray() @IsString({ each: true }) @MaxLength(140, { each: true })
  featuredServiceSlugs?: string[];

  @IsOptional() @IsArray() @IsString({ each: true }) @MaxLength(140, { each: true })
  featuredProjectSlugs?: string[];

  @IsOptional() @IsString() @MaxLength(140)
  whyHeading?: string;

  @IsOptional() @IsString() @MaxLength(600)
  whySubheading?: string;

  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => ValuePropDto)
  valueProps?: ValuePropDto[];

  @IsOptional() @IsString() @MaxLength(140)
  processHeading?: string;

  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => ProcessStepDto)
  processSteps?: ProcessStepDto[];

  @IsOptional() @IsString() @MaxLength(200)
  finalCtaHeading?: string;

  @IsOptional() @IsString() @MaxLength(600)
  finalCtaSubheading?: string;

  @IsOptional() @ValidateNested() @Type(() => CtaDto)
  finalCta?: CtaDto;
}
