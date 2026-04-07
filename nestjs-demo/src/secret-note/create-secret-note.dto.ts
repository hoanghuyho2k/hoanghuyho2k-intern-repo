import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSecretNoteDto {
  @IsString()
  @IsNotEmpty()
  note: string;
}