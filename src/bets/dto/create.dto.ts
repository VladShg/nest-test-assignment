import { IsIn, IsJWT, IsNotEmpty, IsNumber, ValidateIf } from 'class-validator';
import { GameModes } from '../types/GameModes';

export class CreateDto {
  @IsIn([GameModes.Normal, GameModes.Testing])
  @IsNotEmpty()
  mode: string;

  @ValidateIf((entity) => entity?.mode == GameModes.Normal)
  @IsJWT()
  token: string;

  @ValidateIf((entity) => entity?.mode == GameModes.Testing)
  @IsNumber()
  balance: number;
}
