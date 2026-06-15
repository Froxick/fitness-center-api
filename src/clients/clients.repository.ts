import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from '@prisma/client';

@Injectable()
export class ClientsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Client[]> {
    return this.prisma.client.findMany();
  }

  async findById(id: string): Promise<Client | null> {
    return this.prisma.client.findUnique({
      where: { id },
    });
  }

  async findByTrainerId(trainerId: string): Promise<Client[]> {
    return this.prisma.client.findMany({
      where: { trainerId },
    });
  }

  async create(dto: CreateClientDto): Promise<Client> {
    return this.prisma.client.create({
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
    return this.prisma.client.update({
      where: { id },
      data: {
        ...dto,
        birthday: dto.birthday ? new Date(dto.birthday) : undefined,
      },
    });
  }

  async updateStatus(id: string, isActive: boolean): Promise<Client> {
    return this.prisma.client.update({
      where: { id },
      data: { isActive },
    });
  }

  async assignTrainer(clientId: string, trainerId: string): Promise<Client> {
    return this.prisma.client.update({
      where: { id: clientId },
      data: { trainerId },
    });
  }
}
