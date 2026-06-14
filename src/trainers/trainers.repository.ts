import { Injectable } from '@nestjs/common';
import { Trainer, TrainerStatus } from 'src/types/trainer.type';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { randomUUID } from 'crypto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';

@Injectable()
export class TrainersRepository {
  private readonly store = new Map<string, Trainer>();

  findAll(): Trainer[] {
    return Array.from(this.store.values());
  }

  findByid(id: string): Trainer | undefined {
    return this.store.get(id);
  }

  create(dto: CreateTrainerDto): Trainer {
    const trainer: Trainer = {
      id: randomUUID(),
      surname: dto.surname,
      name: dto.name,
      patronymic: dto.patronymic,
      phone: dto.phone,
      status: TrainerStatus.WORKING,
    };

    this.store.set(trainer.id, trainer);
    return trainer;
  }

  update(id: string, dto: UpdateTrainerDto): Trainer {
    const existing = this.store.get(id)!;
    const updated: Trainer = { ...existing, ...dto };
    this.store.set(id, updated);
    return updated;
  }

  updateStatus(id: string, status: TrainerStatus): Trainer {
    const existing = this.store.get(id)!;
    const updated: Trainer = { ...existing, status };
    this.store.set(id, updated);
    return updated;
  }
  existsById(id: string): boolean {
    return this.store.has(id);
  }
}
