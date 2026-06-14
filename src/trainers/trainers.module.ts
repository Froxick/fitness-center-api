import { Module } from '@nestjs/common';
import { TrainersService } from './trainers.service';
import { TrainersController } from './trainers.controller';
import { TrainersRepository } from './trainers.repository';

@Module({
  controllers: [TrainersController],
  providers: [TrainersService, TrainersRepository],
})
export class TrainersModule {}
