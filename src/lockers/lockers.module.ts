import { Module } from '@nestjs/common';
import { LockersController } from './lockers.controller';
import { LockersService } from './lockers.service';
import { ClientsModule } from 'src/clients/clients.module';
import { LockersRepository } from './lockers.repository';

@Module({
  imports: [ClientsModule],
  controllers: [LockersController],
  providers: [LockersService, LockersRepository],
})
export class LockersModule {}
