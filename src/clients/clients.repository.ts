import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from 'src/types/client.type';

@Injectable()
export class ClientsRepository {
  private readonly store = new Map<string, Client>();

  findAll(): Client[] {
    return Array.from(this.store.values());
  }

  findById(id: string): Client | undefined {
    return this.store.get(id);
  }

  findByTrainerId(trainerId: string): Client[] {
    return Array.from(this.store.values()).filter(
      (client) => client.trainerId === trainerId,
    );
  }

  create(dto: CreateClientDto): Client {
    const client: Client = {
      id: randomUUID(),
      surname: dto.surname,
      name: dto.name,
      patronymic: dto.patronymic,
      birthday: dto.birthday,
      phone: dto.phone,
      email: dto.email,
      isActive: true,
      trainerId: dto.trainerId,
    };

    this.store.set(client.id, client);
    return client;
  }

  update(id: string, dto: UpdateClientDto): Client {
    const existing = this.store.get(id)!;
    const updated: Client = { ...existing, ...dto };
    this.store.set(id, updated);
    return updated;
  }

  updateStatus(id: string, isActive: boolean): Client {
    const existing = this.store.get(id)!;
    const updated: Client = { ...existing, isActive };
    this.store.set(id, updated);
    return updated;
  }

  assignTrainer(clientId: string, trainerId: string): Client {
    const existing = this.store.get(clientId)!;
    const updated: Client = { ...existing, trainerId };
    this.store.set(clientId, updated);
    return updated;
  }
}
