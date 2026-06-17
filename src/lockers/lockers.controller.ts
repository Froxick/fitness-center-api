import { Controller, Get } from '@nestjs/common';
import { LockersService } from './lockers.service';

@Controller('api/lockers')
export class LockersController {
  constructor(private readonly lockersService: LockersService) {}

  // GET /api/lockers
  @Get()
  async findAll() {
    return await this.lockersService.findAll();
  }
}
