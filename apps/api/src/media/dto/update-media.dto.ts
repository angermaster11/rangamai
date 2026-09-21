import { IsString, MaxLength } from "class-validator";

/** Admin edit of a media asset's alt text (accessibility). */
export class UpdateMediaDto {
  @IsString() @MaxLength(300)
  alt!: string;
}
