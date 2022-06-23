import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomInt } from 'crypto';
import { constants } from 'src/constants';
import { BetDto } from './dto/spin.dto';
import { BetTypes } from './types/BetTypes';
import { GameModes } from './types/GameModes';
import { TokenPayload } from './types/TokenPayload';

@Injectable()
export class BetsService {
  constructor(private jwtService: JwtService) {}

  signToken(balance): string {
    const payload: TokenPayload = { balance };
    return this.jwtService.sign(payload, { secret: constants.tokenSecret });
  }

  readToken(token: string): TokenPayload {
    const payload: TokenPayload = this.jwtService.verify(token, {
      secret: constants.tokenSecret,
    });
    return payload;
  }

  processBets(
    oldBalance: number,
    bets: BetDto[],
    mode: string,
  ): [number, BetDto[]] {
    let balance = oldBalance;
    const winners: BetDto[] = [];
    bets.forEach((bet: BetDto) => {
      let winner: number;
      if (mode === GameModes.Testing && bet.winningNumber) {
        winner = bet.winningNumber;
      } else {
        winner = randomInt(0, 36);
      }

      const win = () => {
        winners.push(bet);
        balance += bet.betAmount;
      };
      const loose = () => {
        balance -= bet.betAmount;
      };

      if (bet.betType === BetTypes.Even) {
        winner % 2 === 0 ? win() : loose();
      } else if (bet.betType === BetTypes.Odd) {
        winner % 2 !== 0 ? win() : loose();
      } else {
        winner === bet.betType ? win() : loose();
      }
    });
    return [balance, winners];
  }
}
