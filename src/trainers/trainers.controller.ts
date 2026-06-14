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
  create(@Body() dto: CreateTrainerDto) {
    return this.trainersService.create(dto);
  }

  // GET /api/trainers
  @Get()
  findAll() {
    return this.trainersService.findAll();
  }

  // GET /api/trainers/:id/detail
  @Get(':id/detail')
  getDetail(@Param('id') id: string) {
    return this.trainersService.getDetail(id);
  }

  // PUT /api/trainers/:id
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTrainerDto) {
    return this.trainersService.update(id, dto);
  }

  // PATCH /api/trainers/:id/status
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateTrainerStatusDto) {
    return this.trainersService.updateStatus(id, dto);
  }
}
