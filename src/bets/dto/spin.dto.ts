import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  Validate,
  ValidateNested,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BetTypes } from '../types/BetTypes';

@ValidatorConstraint()
class BetTypeValidator implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value == 'number') {
      if (Number(value) >= 0 && Number(value) <= 36) {
        return true;
      }
    } else if (value === BetTypes.Even || value == BetTypes.Odd) {
      return true;
    }
    return false;
  }

  defaultMessage(): string {
    return 'Field should be "odd", "even" or a number: 0 <= N <= 36 ';
  }
}

export class BetDto {
  @IsNotEmpty()
  @Validate(BetTypeValidator)
  betType: string | number;

  @IsNumber()
  @IsPositive()
  betAmount: number;

  @IsNumber()
  @IsOptional()
  winningNumber: number | null;
}

export class SpinDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BetDto)
  bets: BetDto[];
}
