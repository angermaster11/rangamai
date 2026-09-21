import { PartialType } from "@nestjs/mapped-types";
import { CreateServiceDto } from "./create-service.dto";

/** All Create fields optional — used for PATCH. */
export class UpdateServiceDto extends PartialType(CreateServiceDto) {}
