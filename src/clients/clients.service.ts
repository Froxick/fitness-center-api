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
import { Client } from 'src/types/client.type';

@Injectable()
export class ClientsService {
  constructor(
    private readonly clientsRepository: ClientsRepository,
    @Inject(forwardRef(() => TrainersRepository))
    private readonly trainersRepository: TrainersRepository,
  ) {}

  create(dto: CreateClientDto): Client {
    if (dto.trainerId) {
      const trainer = this.trainersRepository.findById(dto.trainerId);
      if (!trainer) {
        throw new BadRequestException(`Тренер с id ${dto.trainerId} не найден`);
      }
    }

    return this.clientsRepository.create(dto);
  }

  findAll(): Client[] {
    return this.clientsRepository.findAll();
  }

  findById(id: string): Client {
    const client = this.clientsRepository.findById(id);

    if (!client) {
      throw new NotFoundException(`Клиент с id ${id} не найден`);
    }

    return client;
  }

  getDetail(id: string) {
    const client = this.clientsRepository.findById(id);

    if (!client) {
      throw new NotFoundException(`Клиент с id ${id} не найден`);
    }

    const trainer = client.trainerId
      ? this.trainersRepository.findById(client.trainerId)
      : null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { trainerId, ...clientWithoutTrainerId } = client;

    return {
      ...clientWithoutTrainerId,
      trainer: trainer ?? null,
    };
  }

  update(id: string, dto: UpdateClientDto): Client {
    const client = this.clientsRepository.findById(id);

    if (!client) {
      throw new NotFoundException(`Клиент с id ${id} не найден`);
    }

    if (dto.trainerId) {
      const trainer = this.trainersRepository.findById(dto.trainerId);
      if (!trainer) {
        throw new BadRequestException(`Тренер с id ${dto.trainerId} не найден`);
      }
    }

    return this.clientsRepository.update(id, dto);
  }

  updateStatus(id: string, dto: UpdateClientStatusDto): Client {
    const client = this.clientsRepository.findById(id);

    if (!client) {
      throw new NotFoundException(`Клиент с id ${id} не найден`);
    }

    return this.clientsRepository.updateStatus(id, dto.isActive);
  }

  assignTrainer(clientId: string, trainerId: string): Client {
    const client = this.clientsRepository.findById(clientId);

    if (!client) {
      throw new NotFoundException(`Клиент с id ${clientId} не найден`);
    }

    const trainer = this.trainersRepository.findById(trainerId);

    if (!trainer) {
      throw new NotFoundException(`Тренер с id ${trainerId} не найден`);
    }

    return this.clientsRepository.assignTrainer(clientId, trainerId);
  }
}
