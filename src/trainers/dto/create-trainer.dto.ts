import {
  IsString,
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateTrainerDto {
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

  @IsString()
  @IsNotEmpty({ message: 'Телефон обязателен' })
  @Matches(/^\+?[0-9\s\-().]{7,20}$/, {
    message: 'Некорректный формат номера телефона',
  })
  phone: string;
}
