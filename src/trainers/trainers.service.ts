import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TrainersRepository } from './trainers.repository';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { UpdateTrainerStatusDto } from './dto/update-trainer-status.dto';

import { ClientsRepository } from 'src/clients/clients.repository';
import { Trainer } from '@prisma/client';

@Injectable()
export class TrainersService {
  constructor(
    private readonly trainersRepository: TrainersRepository,
    @Inject(forwardRef(() => ClientsRepository))
    private readonly clientsRepository: ClientsRepository,
  ) {}

  async create(dto: CreateTrainerDto): Promise<Trainer> {
    return await this.trainersRepository.create(dto);
  }

  async findAll(): Promise<Trainer[]> {
    return await this.trainersRepository.findAll();
  }

  async update(id: string, dto: UpdateTrainerDto): Promise<Trainer> {
    const trainer = await this.trainersRepository.findById(id);

    if (!trainer) {
      throw new NotFoundException(`Тренер с id ${id} не найден`);
    }

    return await this.trainersRepository.update(id, dto);
  }

  async updateStatus(
    id: string,
    dto: UpdateTrainerStatusDto,
  ): Promise<Trainer> {
    const trainer = await this.trainersRepository.findById(id);

    if (!trainer) {
      throw new NotFoundException(`Тренер с id ${id} не найден`);
    }

    return await this.trainersRepository.updateStatus(id, dto.status);
  }

  async getDetail(id: string) {
    const trainer = await this.trainersRepository.findById(id);

    if (!trainer) {
      throw new NotFoundException(`Тренер с id ${id} не найден`);
    }

    const clients = await this.clientsRepository.findByTrainerId(id);

    return {
      ...trainer,
      clients,
    };
  }
}
