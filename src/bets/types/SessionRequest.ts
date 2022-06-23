import { Request } from 'express';
import { Session } from 'express-session';

export type SessionPayload = Session & {
  balance: string | null;
  balanceStart: string | null;
  mode: string | null;
};

export type SessionRequest = Request & {
  session?: SessionPayload;
};
