import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Homepage, HomepageSchema } from "./schemas/homepage.schema";
import { HomepageService } from "./homepage.service";
import {
  AdminHomepageController,
  HomepageController,
} from "./homepage.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Homepage.name, schema: HomepageSchema },
    ]),
  ],
  controllers: [HomepageController, AdminHomepageController],
  providers: [HomepageService],
  exports: [HomepageService],
})
export class HomepageModule {}
