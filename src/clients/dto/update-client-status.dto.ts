import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class UpdateClientStatusDto {
  @IsBoolean({ message: 'is_active должен быть булевым значением' })
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value;
  })
  isActive: boolean;
}
