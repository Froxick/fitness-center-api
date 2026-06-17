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
  async create(@Body() dto: CreateClientDto) {
    return await this.clientsService.create(dto);
  }

  // GET /api/clients
  @Get()
  async findAll() {
    return await this.clientsService.findAll();
  }

  // GET /api/clients/:id/detail
  @Get(':id/detail')
  async getDetail(@Param('id') id: string) {
    return await this.clientsService.getDetail(id);
  }

  // GET /api/clients/:id
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.clientsService.findById(id);
  }

  // PUT /api/clients/:id
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateClientDto) {
    return await this.clientsService.update(id, dto);
  }

  // PATCH /api/clients/:id/status
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateClientStatusDto,
  ) {
    return await this.clientsService.updateStatus(id, dto);
  }

  // POST /api/clients/:clientId/trainer/:trainerId
  @Post(':clientId/trainer/:trainerId')
  @HttpCode(HttpStatus.OK)
  async assignTrainer(
    @Param('clientId') clientId: string,
    @Param('trainerId') trainerId: string,
  ) {
    return await this.clientsService.assignTrainer(clientId, trainerId);
  }

  // POST /api/clients/:clientId/locker/:lockerId
  @Post(':clientId/locker/:lockerId')
  @HttpCode(HttpStatus.OK)
  async assignLocker(
    @Param('clientId') clientId: string,
    @Param('lockerId') lockerId: string,
  ) {
    return await this.clientsService.assignLocker(clientId, lockerId);
  }

  // POST /api/clients/:clientId/additionalServices/:serviceId
  @Post(':clientId/additionalServices/:serviceId')
  @HttpCode(HttpStatus.OK)
  async addService(
    @Param('clientId') clientId: string,
    @Param('serviceId') serviceId: string,
  ) {
    return await this.clientsService.addService(clientId, serviceId);
  }
}
