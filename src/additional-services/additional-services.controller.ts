import { Controller, Get, Param } from '@nestjs/common';
import { AdditionalServicesService } from './additional-services.service';

@Controller('api/additionalServices')
export class AdditionalServicesController {
  constructor(private readonly servicesService: AdditionalServicesService) {}

  // GET /api/additionalServices
  @Get()
  async findAll() {
    return await this.servicesService.findAll();
  }

  // GET /api/additionalServices/:id
  @Get(':id')
  async findByIdWithClients(@Param('id') id: string) {
    return await this.servicesService.findByIdWithClients(id);
  }
}
