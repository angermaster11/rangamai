import { Type } from "class-transformer";
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from "class-validator";

/** Validated SEO metadata block. */
export class SeoMetaDto {
  @IsOptional() @IsString() @MaxLength(200) metaTitle?: string;
  @IsOptional() @IsString() @MaxLength(320) metaDescription?: string;
  @IsOptional() @IsString() @MaxLength(500) canonicalUrl?: string;
  @IsOptional() @IsString() @MaxLength(500) ogImage?: string;
}

/** Validated media reference. */
export class MediaRefDto {
  @IsString() @MaxLength(1000) url!: string;
  @IsString() @MaxLength(300) alt!: string;
  @IsOptional() @IsNumber() width?: number;
  @IsOptional() @IsNumber() height?: number;
}

/** Validated CTA link. */
export class CtaDto {
  @IsString() @MaxLength(80) label!: string;
  @IsString() @MaxLength(500) href!: string;
}

/** Helper to attach a nested optional media ref. */
export function OptionalMediaRef() {
  return function (target: object, propertyKey: string) {
    IsOptional()(target, propertyKey);
    ValidateNested()(target, propertyKey);
    Type(() => MediaRefDto)(target, propertyKey);
  };
}
