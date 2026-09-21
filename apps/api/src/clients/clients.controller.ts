import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import type { Client as ClientDto } from "@rangamai/shared";
import { ClientsService } from "./clients.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { ReorderDto } from "../common/dto/reorder.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

/** Public read endpoint for the "Trusted By" section. */
@Controller("clients")
export class ClientsController {
  constructor(private readonly clients: ClientsService) {}

  @Get()
  findPublic(): Promise<ClientDto[]> {
    return this.clients.findPublic();
  }
}

@Controller("admin/clients")
@UseGuards(JwtAuthGuard)
export class AdminClientsController {
  constructor(private readonly clients: ClientsService) {}

  @Get()
  findAll(): Promise<ClientDto[]> {
    return this.clients.findAll();
  }

  @Post("reorder")
  reorder(@Body() dto: ReorderDto): Promise<ClientDto[]> {
    return this.clients.reorder(dto.ids);
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<ClientDto> {
    return this.clients.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateClientDto): Promise<ClientDto> {
    return this.clients.create(dto);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() dto: UpdateClientDto,
  ): Promise<ClientDto> {
    return this.clients.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string): Promise<{ id: string }> {
    return this.clients.remove(id);
  }
}
