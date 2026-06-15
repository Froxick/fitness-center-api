import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientsRepository } from './clients.repository';
import { TrainersRepository } from 'src/trainers/trainers.repository';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { UpdateClientStatusDto } from './dto/update-client-status.dto';
import { Client } from '@prisma/client';

@Injectable()
export class ClientsService {
  constructor(
    private readonly clientsRepository: ClientsRepository,
    @Inject(forwardRef(() => TrainersRepository))
    private readonly trainersRepository: TrainersRepository,
  ) {}

  async create(dto: CreateClientDto): Promise<Client> {
    if (dto.trainerId) {
      const trainer = await this.trainersRepository.findById(dto.trainerId);
      if (!trainer) {
        throw new BadRequestException(`Тренер с id ${dto.trainerId} не найден`);
      }
    }

    return this.clientsRepository.create(dto);
  }

  async findAll(): Promise<Client[]> {
    return await this.clientsRepository.findAll();
  }

  async findById(id: string): Promise<Client> {
    const client = await this.clientsRepository.findById(id);

    if (!client) {
      throw new NotFoundException(`Клиент с id ${id} не найден`);
    }

    return client;
  }

  async getDetail(id: string) {
    const client = await this.clientsRepository.findById(id);

    if (!client) {
      throw new NotFoundException(`Клиент с id ${id} не найден`);
    }

    const trainer = client.trainerId
      ? await this.trainersRepository.findById(client.trainerId)
      : null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { trainerId, ...clientWithoutTrainerId } = client;

    return {
      ...clientWithoutTrainerId,
      trainer: trainer ?? null,
    };
  }

  async update(id: string, dto: UpdateClientDto): Promise<Client> {
    const client = await this.clientsRepository.findById(id);

    if (!client) {
      throw new NotFoundException(`Клиент с id ${id} не найден`);
    }

    if (dto.trainerId) {
      const trainer = await this.trainersRepository.findById(dto.trainerId);
      if (!trainer) {
        throw new BadRequestException(`Тренер с id ${dto.trainerId} не найден`);
      }
    }

    return await this.clientsRepository.update(id, dto);
  }

  async updateStatus(id: string, dto: UpdateClientStatusDto): Promise<Client> {
    const client = await this.clientsRepository.findById(id);

    if (!client) {
      throw new NotFoundException(`Клиент с id ${id} не найден`);
    }

    return this.clientsRepository.updateStatus(id, dto.isActive);
  }

  async assignTrainer(clientId: string, trainerId: string): Promise<Client> {
    const client = await this.clientsRepository.findById(clientId);

    if (!client) {
      throw new NotFoundException(`Клиент с id ${clientId} не найден`);
    }

    const trainer = await this.trainersRepository.findById(trainerId);

    if (!trainer) {
      throw new NotFoundException(`Тренер с id ${trainerId} не найден`);
    }

    return await this.clientsRepository.assignTrainer(clientId, trainerId);
  }
}
