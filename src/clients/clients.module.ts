import { forwardRef, Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { ClientsRepository } from './clients.repository';

import { TrainersModule } from 'src/trainers/trainers.module';
import { LockersRepository } from 'src/lockers/lockers.repository';
import { AdditionalServicesRepository } from 'src/additional-services/additional-services.repository';

@Module({
  imports: [forwardRef(() => TrainersModule)],
  controllers: [ClientsController],
  providers: [
    ClientsService,
    ClientsRepository,
    LockersRepository,
    AdditionalServicesRepository,
  ],
  exports: [ClientsRepository],
})
export class ClientsModule {}
