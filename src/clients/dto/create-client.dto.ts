import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsUUID,
  IsDateString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty({ message: 'Фамилия обязательна' })
  @MaxLength(100)
  surname: string;

  @IsString()
  @IsNotEmpty({ message: 'Имя обязательно' })
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  patronymic?: string;

  @IsDateString(
    {},
    { message: 'Дата рождения должна быть в формате ISO 8601 (YYYY-MM-DD)' },
  )
  birthday: string;

  @IsString()
  @IsNotEmpty({ message: 'Телефон обязателен' })
  @Matches(/^\+?[0-9\s\-().]{7,20}$/, {
    message: 'Некорректный формат номера телефона',
  })
  phone: string;

  @IsEmail({}, { message: 'Некорректный email' })
  email: string;

  @IsOptional()
  @IsUUID('4', { message: 'trainer_id должен быть валидным UUID' })
  trainerId?: string;
}
