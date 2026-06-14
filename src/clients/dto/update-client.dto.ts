import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';

export class UpdateClientDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  surname?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  patronymic?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'Дата рождения должна быть в формате ISO 8601 (YYYY-MM-DD)' },
  )
  birthday?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9\s\-().]{7,20}$/, {
    message: 'Некорректный формат номера телефона',
  })
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Некорректный email' })
  email?: string;

  @IsOptional()
  @IsUUID('4', { message: 'trainer_id должен быть валидным UUID' })
  trainerId?: string;
}
