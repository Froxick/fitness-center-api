import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { LockersRepository } from './lockers.repository';
import { ClientsRepository } from 'src/clients/clients.repository';

@Injectable()
export class LockersService {
  constructor(
    private readonly lockersRepository: LockersRepository,
    private readonly clientsRepository: ClientsRepository,
  ) {}

  async findAll() {
    return await this.lockersRepository.findAll();
  }

  async assignToClient(lockerId: string, clientId: string) {
    const locker = await this.lockersRepository.findById(lockerId);
    if (!locker) {
      throw new NotFoundException(`Шкафчик с id ${lockerId} не найден`);
    }

    const client = await this.clientsRepository.findById(clientId);
    if (!client) {
      throw new NotFoundException(`Клиент с id ${clientId} не найден`);
    }

    const occupied = await this.lockersRepository.isOccupied(lockerId);
    if (occupied) {
      throw new ConflictException(`Шкафчик уже занят`);
    }

    if (client.lockerId) {
      throw new ConflictException(`У клиента уже назначен шкафчик`);
    }

    return await this.lockersRepository.assignToClient(lockerId, clientId);
  }
}
