import { Injectable } from '@nestjs/common';
import { LockersRepository } from './lockers.repository';

@Injectable()
export class LockersService {
  constructor(private readonly lockersRepository: LockersRepository) {}

  async findAll() {
    return await this.lockersRepository.findAll();
  }
}
