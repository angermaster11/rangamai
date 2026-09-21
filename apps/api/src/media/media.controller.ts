import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import type { Media as MediaDto } from "@rangamai/shared";
import { MediaService } from "./media.service";
import { UpdateMediaDto } from "./dto/update-media.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);

/** Admin-only media library — upload, list, edit alt text, delete. */
@Controller("admin/media")
@UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(private readonly media: MediaService) {}

  @Get()
  findAll(): Promise<MediaDto[]> {
    return this.media.findAll();
  }

  @Post()
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
      limits: { fileSize: MAX_BYTES, files: 1 },
      fileFilter: (_req, file, cb) => {
        // Reject non-images up front so we never buffer a large non-image.
        if (!ALLOWED.has(file.mimetype)) {
          cb(new BadRequestException("Only image uploads are allowed (jpg, png, webp, avif, gif)"), false);
          return;
        }
        cb(null, true);
      },
    }),
  )
  upload(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body("alt") alt?: string,
  ): Promise<MediaDto> {
    if (!file) {
      throw new BadRequestException("No file uploaded (field name must be 'file')");
    }
    return this.media.upload(file.buffer, alt ?? "");
  }

  @Patch(":id")
  updateAlt(
    @Param("id") id: string,
    @Body() dto: UpdateMediaDto,
  ): Promise<MediaDto> {
    return this.media.updateAlt(id, dto.alt);
  }

  @Delete(":id")
  remove(@Param("id") id: string): Promise<{ id: string }> {
    return this.media.remove(id);
  }
}
