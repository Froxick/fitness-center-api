import { Module } from '@nestjs/common';
import { AdditionalServicesController } from './additional-services.controller';
import { AdditionalServicesService } from './additional-services.service';
import { AdditionalServicesRepository } from './additional-services.repository';

@Module({
  controllers: [AdditionalServicesController],
  providers: [AdditionalServicesService, AdditionalServicesRepository],
  exports: [AdditionalServicesRepository],
})
export class AdditionalServicesModule {}
