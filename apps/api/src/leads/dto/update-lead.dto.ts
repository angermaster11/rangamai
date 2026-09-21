import { IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
import { LeadStatus } from "@rangamai/shared";

/** Admin-only mutation: move status through the pipeline and attach notes. */
export class UpdateLeadDto {
  @IsOptional()
  @IsEnum(LeadStatus, { message: "status must be a valid lead status" })
  status?: LeadStatus;

  @IsOptional() @IsString() @MaxLength(5000)
  notes?: string;
}
