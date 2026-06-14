import { forwardRef, Module } from '@nestjs/common';
import { TrainersService } from './trainers.service';
import { TrainersController } from './trainers.controller';
import { TrainersRepository } from './trainers.repository';
import { ClientsModule } from 'src/clients/clients.module';

@Module({
  imports: [forwardRef(() => ClientsModule)],
  controllers: [TrainersController],
  providers: [TrainersService, TrainersRepository],
  exports: [TrainersRepository],
})
export class TrainersModule {}
