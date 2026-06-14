import { IsEnum } from 'class-validator';
import { TrainerStatus } from 'src/types/trainer.type';

export class UpdateTrainerStatusDto {
  @IsEnum(TrainerStatus, {
    message: `Статус должен быть одним из: ${Object.values(TrainerStatus).join(', ')}`,
  })
  status: TrainerStatus;
}
