import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { LockersService } from './lockers.service';

@Controller('api/lockers')
export class LockersController {
  constructor(private readonly lockersService: LockersService) {}

  // GET /api/lockers
  @Get()
  async findAll() {
    return await this.lockersService.findAll();
  }

  // POST /api/lockers/:lockerId/client/:clientId
  @Post(':lockerId/client/:clientId')
  @HttpCode(HttpStatus.OK)
  async assignToClient(
    @Param('lockerId') lockerId: string,
    @Param('clientId') clientId: string,
  ) {
    return await this.lockersService.assignToClient(lockerId, clientId);
  }
}
