import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { UpdateClientStatusDto } from './dto/update-client-status.dto';

@Controller('api/clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  // POST /api/clients
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateClientDto) {
    return this.clientsService.create(dto);
  }

  // GET /api/clients
  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  // GET /api/clients/:id
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.clientsService.findById(id);
  }

  // GET /api/clients/:id/detail
  @Get(':id/detail')
  getDetail(@Param('id') id: string) {
    return this.clientsService.getDetail(id);
  }

  // PUT /api/clients/:id
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateClientDto) {
    return this.clientsService.update(id, dto);
  }

  // PATCH /api/clients/:id/status
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateClientStatusDto) {
    return this.clientsService.updateStatus(id, dto);
  }

  // POST /api/clients/:clientId/trainer/:trainerId
  @Post(':clientId/trainer/:trainerId')
  @HttpCode(HttpStatus.OK)
  assignTrainer(
    @Param('clientId') clientId: string,
    @Param('trainerId') trainerId: string,
  ) {
    return this.clientsService.assignTrainer(clientId, trainerId);
  }
}
