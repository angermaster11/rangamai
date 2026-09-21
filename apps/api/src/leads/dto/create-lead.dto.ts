import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

/**
 * Public contact-form payload. Matches shared `LeadInput`. Server-managed
 * fields (status, notes, source) are never accepted here — `whitelist: true`
 * strips anything extra.
 */
export class CreateLeadDto {
  @IsString() @MinLength(1) @MaxLength(120)
  name!: string;

  @IsEmail({}, { message: "email must be a valid email address" })
  @MaxLength(200)
  email!: string;

  @IsOptional() @IsString() @MaxLength(40)
  phone?: string;

  @IsOptional() @IsString() @MaxLength(160)
  company?: string;

  @IsOptional() @IsString() @MaxLength(160)
  service?: string;

  @IsOptional() @IsString() @MaxLength(80)
  budgetRange?: string;

  @IsOptional() @IsString() @MaxLength(80)
  projectType?: string;

  @IsString() @MinLength(1) @MaxLength(5000)
  message!: string;
}
