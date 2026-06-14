import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class UpdateTrainerDto {
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
  @IsString()
  @Matches(/^\+?[0-9\s\-().]{7,20}$/, {
    message: 'Некорректный формат номера телефона',
  })
  phone?: string;
}
