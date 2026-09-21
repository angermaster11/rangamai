import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Client, ClientSchema } from "./schemas/client.schema";
import { ClientsService } from "./clients.service";
import {
  AdminClientsController,
  ClientsController,
} from "./clients.controller";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
  ],
  controllers: [ClientsController, AdminClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
