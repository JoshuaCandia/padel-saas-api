import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCourtDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
