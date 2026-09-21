import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Media, MediaSchema } from "./schemas/media.schema";
import { MediaService } from "./media.service";
import { CloudinaryService } from "./cloudinary.service";
import { MediaController } from "./media.controller";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Media.name, schema: MediaSchema }]),
  ],
  controllers: [MediaController],
  providers: [MediaService, CloudinaryService],
  exports: [MediaService],
})
export class MediaModule {}
