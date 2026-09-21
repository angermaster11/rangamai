import { IsArray, IsMongoId, ArrayNotEmpty } from "class-validator";

/** Payload for reordering: the full list of ids in the desired order. */
export class ReorderDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  ids!: string[];
}
