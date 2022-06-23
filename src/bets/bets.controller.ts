import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  Req,
  Session,
} from '@nestjs/common';
import { Request } from 'express';
import { BetsService } from './bets.service';
import { CreateDto } from './dto/create.dto';
import { EndDto } from './dto/end.dto';
import { BetDto, SpinDto } from './dto/spin.dto';
import { GameModes } from './types/GameModes';
@Controller('bets')
export class BetsController {
  constructor(private betsService: BetsService) {}

  @Post('/create')
  create(@Body() body: CreateDto, @Session() session: Record<string, any>) {
    let balance: number;

    if (body.mode === GameModes.Normal) {
      const payload = this.betsService.readToken(body.token);
      balance = payload.balance;
    } else if (body.mode === GameModes.Testing) {
      balance = body.balance;
    }

    session.mode = body.mode;
    session.balance = balance.toString();
    session.balanceStart = balance.toString();
  }

  @Patch('/spin')
  spin(
    @Body() body: SpinDto,
    @Session() session: Record<string, any>,
  ): BetDto[] {
    const startBalance: number = Number.parseInt(session.balance);
    const mode = session.mode;

    let totalBet = 0;
    body.bets.forEach((bet: BetDto) => {
      totalBet += bet.betAmount;
    });
    if (totalBet > startBalance) {
      throw new BadRequestException('Not enough balance');
    }

    const [endBalance, winners] = this.betsService.processBets(
      startBalance,
      body.bets,
      mode,
    );

    session.balance = endBalance.toString();
    return winners;
  }

  @Delete('/end')
  end(@Session() session: Record<string, any>, @Req() req: Request): EndDto {
    const response: EndDto = {
      balanceStart: Number.parseInt(session.balanceStart),
      balanceEnd: Number.parseInt(session.balance),
    };
    req.session.destroy(null);
    return response;
  }
}
