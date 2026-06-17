import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TrainersService } from './trainers.service';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { UpdateTrainerStatusDto } from './dto/update-trainer-status.dto';

@Controller('api/trainers')
export class TrainersController {
  constructor(private readonly trainersService: TrainersService) {}

  // POST /api/trainers
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateTrainerDto) {
    return await this.trainersService.create(dto);
  }

  // GET /api/trainers
  @Get()
  async findAll() {
    return await this.trainersService.findAll();
  }

  // GET /api/trainers/:id/detail
  @Get(':id/detail')
  async getDetail(@Param('id') id: string) {
    return await this.trainersService.getDetail(id);
  }

  // PUT /api/trainers/:id
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateTrainerDto) {
    return await this.trainersService.update(id, dto);
  }

  // PATCH /api/trainers/:id/status
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateTrainerStatusDto,
  ) {
    return await this.trainersService.updateStatus(id, dto);
  }
}
