import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { constants } from 'src/constants';
import { BetsController } from './bets.controller';
import { BetsService } from './bets.service';

@Module({
  controllers: [BetsController],
  providers: [BetsService],
  imports: [
    JwtModule.register({
      secret: constants.tokenSecret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
})
export class BetsModule {}
