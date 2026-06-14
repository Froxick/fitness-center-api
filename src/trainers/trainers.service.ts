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
import { Trainer } from 'src/types/trainer.type';
import { ClientsRepository } from 'src/clients/clients.repository';

@Injectable()
export class TrainersService {
  constructor(
    private readonly trainersRepository: TrainersRepository,
    @Inject(forwardRef(() => ClientsRepository))
    private readonly clientsRepository: ClientsRepository,
  ) {}

  create(dto: CreateTrainerDto): Trainer {
    return this.trainersRepository.create(dto);
  }

  findAll(): Trainer[] {
    return this.trainersRepository.findAll();
  }

  update(id: string, dto: UpdateTrainerDto): Trainer {
    const trainer = this.trainersRepository.findById(id);

    if (!trainer) {
      throw new NotFoundException(`Тренер с id ${id} не найден`);
    }

    return this.trainersRepository.update(id, dto);
  }

  updateStatus(id: string, dto: UpdateTrainerStatusDto): Trainer {
    const trainer = this.trainersRepository.findById(id);

    if (!trainer) {
      throw new NotFoundException(`Тренер с id ${id} не найден`);
    }

    return this.trainersRepository.updateStatus(id, dto.status);
  }

  getDetail(id: string) {
    const trainer = this.trainersRepository.findById(id);

    if (!trainer) {
      throw new NotFoundException(`Тренер с id ${id} не найден`);
    }

    const clients = this.clientsRepository.findByTrainerId(id);

    return {
      ...trainer,
      clients,
    };
  }
}
