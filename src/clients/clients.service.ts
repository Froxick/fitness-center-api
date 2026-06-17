import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientsRepository } from './clients.repository';
import { TrainersRepository } from 'src/trainers/trainers.repository';
import { LockersRepository } from 'src/lockers/lockers.repository';
import { AdditionalServicesRepository } from 'src/additional-services/additional-services.repository';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { UpdateClientStatusDto } from './dto/update-client-status.dto';
import { Client } from 'generated/prisma/client';

@Injectable()
export class ClientsService {
  constructor(
    private readonly clientsRepository: ClientsRepository,
    @Inject(forwardRef(() => TrainersRepository))
    private readonly trainersRepository: TrainersRepository,
    private readonly lockersRepository: LockersRepository,
    private readonly servicesRepository: AdditionalServicesRepository,
  ) {}

  async create(dto: CreateClientDto): Promise<Client> {
    if (dto.trainerId) {
      const trainer = await this.trainersRepository.findById(dto.trainerId);
      if (!trainer) {
        throw new BadRequestException(`Тренер с id ${dto.trainerId} не найден`);
      }
    }
    return await this.clientsRepository.create(dto);
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
    const client = await this.clientsRepository.findByIdWithDetails(id);
    if (!client) {
      throw new NotFoundException(`Клиент с id ${id} не найден`);
    }

    return {
      ...client,
      services: client.services.map((cs) => cs.service),
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
    return await this.clientsRepository.updateStatus(id, dto.isActive);
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

  async assignLocker(clientId: string, lockerId: string): Promise<Client> {
    const client = await this.clientsRepository.findById(clientId);
    if (!client) {
      throw new NotFoundException(`Клиент с id ${clientId} не найден`);
    }

    const locker = await this.lockersRepository.findById(lockerId);
    if (!locker) {
      throw new NotFoundException(`Шкафчик с id ${lockerId} не найден`);
    }

    const occupied = await this.lockersRepository.isOccupied(lockerId);
    if (occupied) {
      throw new ConflictException(`Шкафчик уже занят`);
    }

    if (client.lockerId) {
      throw new ConflictException(`У клиента уже назначен шкафчик`);
    }

    return await this.clientsRepository.assignLocker(clientId, lockerId);
  }

  async addService(clientId: string, serviceId: string) {
    const client = await this.clientsRepository.findById(clientId);
    if (!client) {
      throw new NotFoundException(`Клиент с id ${clientId} не найден`);
    }

    const service = await this.servicesRepository.findById(serviceId);
    if (!service) {
      throw new NotFoundException(`Услуга с id ${serviceId} не найдена`);
    }

    const alreadyHas = await this.clientsRepository.hasService(
      clientId,
      serviceId,
    );
    if (alreadyHas) {
      throw new ConflictException(`У клиента уже есть эта услуга`);
    }

    return await this.clientsRepository.addService(clientId, serviceId);
  }
}
