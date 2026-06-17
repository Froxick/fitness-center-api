import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from 'generated/prisma/client';

@Injectable()
export class ClientsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Client[]> {
    return await this.prisma.client.findMany();
  }

  async findById(id: string): Promise<Client | null> {
    return await this.prisma.client.findUnique({
      where: { id },
    });
  }

  async findByIdWithDetails(id: string) {
    return await this.prisma.client.findUnique({
      where: { id },
      include: {
        trainer: true,
        locker: true,
        services: {
          include: {
            service: true,
          },
        },
      },
    });
  }

  async findByTrainerId(trainerId: string): Promise<Client[]> {
    return await this.prisma.client.findMany({
      where: { trainerId },
    });
  }

  async create(dto: CreateClientDto): Promise<Client> {
    return await this.prisma.client.create({
      data: {
        surname: dto.surname,
        name: dto.name,
        patronymic: dto.patronymic,
        birthday: new Date(dto.birthday),
        phone: dto.phone,
        email: dto.email,
        isActive: true,
        trainerId: dto.trainerId,
      },
    });
  }

  async update(id: string, dto: UpdateClientDto): Promise<Client> {
    return await this.prisma.client.update({
      where: { id },
      data: {
        ...dto,
        birthday: dto.birthday ? new Date(dto.birthday) : undefined,
      },
    });
  }

  async updateStatus(id: string, isActive: boolean): Promise<Client> {
    return await this.prisma.client.update({
      where: { id },
      data: { isActive },
    });
  }

  async assignTrainer(clientId: string, trainerId: string): Promise<Client> {
    return await this.prisma.client.update({
      where: { id: clientId },
      data: { trainerId },
    });
  }

  async assignLocker(clientId: string, lockerId: string): Promise<Client> {
    return await this.prisma.client.update({
      where: { id: clientId },
      data: { lockerId },
    });
  }

  async addService(clientId: string, serviceId: string) {
    return await this.prisma.clientService.create({
      data: { clientId, serviceId },
      include: { service: true },
    });
  }

  async hasService(clientId: string, serviceId: string): Promise<boolean> {
    const cs = await this.prisma.clientService.findUnique({
      where: { clientId_serviceId: { clientId, serviceId } },
    });
    return cs !== null;
  }
}
