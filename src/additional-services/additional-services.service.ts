import { Injectable, NotFoundException } from '@nestjs/common';
import { AdditionalServicesRepository } from './additional-services.repository';

@Injectable()
export class AdditionalServicesService {
  constructor(
    private readonly servicesRepository: AdditionalServicesRepository,
  ) {}

  async findAll() {
    return await this.servicesRepository.findAll();
  }

  async findByIdWithClients(id: string) {
    const service = await this.servicesRepository.findByIdWithClients(id);

    if (!service) {
      throw new NotFoundException(`Услуга с id ${id} не найдена`);
    }

    return {
      ...service,
      clients: service.clients.map((cs) => cs.client),
    };
  }
}
