/* eslint-disable @typescript-eslint/no-empty-function */

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BetsService } from './bets.service';
import { CreateDto } from './dto/create.dto';
import { EndDto } from './dto/end.dto';
import { ResponseDto } from './dto/response.dto';
import { BetDto, SpinDto } from './dto/spin.dto';
import { SessionGuard } from './session.guard';
import { GameModes } from './types/GameModes';
import { SessionRequest } from './types/SessionRequest';
@Controller('bets')
export class BetsController {
  constructor(private betsService: BetsService) {}

  @Post('/create')
  create(@Body() body: CreateDto, @Req() req: SessionRequest): ResponseDto {
    let balance: number;

    if (body.mode === GameModes.Normal) {
      const payload = this.betsService.readToken(body.token);
      balance = payload.balance;
    } else if (body.mode === GameModes.Testing) {
      balance = body.balance;
    }

    req.session.regenerate(() => {});
    req.session.reload(() => {});
    req.session.mode = body.mode;
    req.session.balance = balance.toString();
    req.session.balanceStart = balance.toString();

    return { response: 'game created' };
  }

  @UseGuards(SessionGuard)
  @Patch('/spin')
  spin(@Body() body: SpinDto, @Req() req: SessionRequest): BetDto[] {
    const startBalance: number = Number.parseInt(req.session.balance);
    const mode = req.session.mode;

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

    req.session.balance = endBalance.toString();
    return winners;
  }

  @UseGuards(SessionGuard)
  @Delete('/end')
  end(@Req() req: SessionRequest): EndDto {
    if (!req.session.balance)
      throw new BadRequestException('Session not valid');
    const response: EndDto = {
      balanceStart: Number.parseInt(req.session.balance),
      balanceEnd: Number.parseInt(req.session.balance),
    };
    req.session.regenerate(() => {});
    return response;
  }
}
