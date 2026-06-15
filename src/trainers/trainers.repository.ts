import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { Trainer, TrainerStatus } from '@prisma/client';

@Injectable()
export class TrainersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Trainer[]> {
    return await this.prisma.trainer.findMany();
  }

  async findById(id: string): Promise<Trainer | null> {
    return await this.prisma.trainer.findUnique({
      where: { id },
    });
  }

  async create(dto: CreateTrainerDto): Promise<Trainer> {
    return await this.prisma.trainer.create({
      data: {
        surname: dto.surname,
        name: dto.name,
        patronymic: dto.patronymic,
        phone: dto.phone,
        status: TrainerStatus.WORKING,
      },
    });
  }

  async update(id: string, dto: UpdateTrainerDto): Promise<Trainer> {
    return await this.prisma.trainer.update({
      where: { id },
      data: dto,
    });
  }

  async updateStatus(id: string, status: TrainerStatus): Promise<Trainer> {
    return await this.prisma.trainer.update({
      where: { id },
      data: { status },
    });
  }

  async existsById(id: string): Promise<boolean> {
    return await this.prisma.trainer
      .findUnique({ where: { id } })
      .then((t) => t !== null);
  }
}
