import { Injectable } from '@nestjs/common';
import { Service } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdditionalServicesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Service[]> {
    return await this.prisma.service.findMany();
  }

  async findById(id: string): Promise<Service | null> {
    return await this.prisma.service.findUnique({
      where: { id },
    });
  }

  async findByIdWithClients(id: string) {
    return await this.prisma.service.findUnique({
      where: { id },
      include: {
        clients: {
          include: {
            client: {
              select: {
                id: true,
                surname: true,
                name: true,
                patronymic: true,
                phone: true,
                email: true,
                isActive: true,
              },
            },
          },
        },
      },
    });
  }

  async clientHasService(
    clientId: string,
    serviceId: string,
  ): Promise<boolean> {
    return await this.prisma.clientService
      .findUnique({
        where: { clientId_serviceId: { clientId, serviceId } },
      })
      .then((cs) => cs !== null);
  }

  async addToClient(clientId: string, serviceId: string) {
    return await this.prisma.clientService.create({
      data: { clientId, serviceId },
      include: { service: true },
    });
  }
}
