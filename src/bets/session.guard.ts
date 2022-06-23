import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SessionRequest } from './types/SessionRequest';

@Injectable()
export class SessionGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: SessionRequest = context.switchToHttp().getRequest();
    if (!request.session.balance) {
      return false;
    }
    return true;
  }
}
