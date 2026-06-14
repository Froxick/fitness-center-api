import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import { TrainersModule } from './trainers/trainers.module';

@Module({
  imports: [ClientsModule, TrainersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
