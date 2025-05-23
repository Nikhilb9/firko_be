import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

interface RateLimitEntry {
  count: number;
  lastRequestTime: number;
}

//Currently this request rate limitter only works on place module but if you want to make it more dynamic you can add it on controller level using Guard function or request level and path type
// If server restart all saved data will be erased this only works for single instance - and server should not restart - redis can be used or depends on use case
// works different for all path
@Injectable()
export class RequestRateLimiterGuard implements CanActivate {
  private readonly requests: Map<string, RateLimitEntry> = new Map();

  constructor(
    private readonly LIMIT: number,
    private readonly TTL: number,
    private readonly SKIP_RATE_LIMITTER: boolean,
  ) {}
  canActivate(context: ExecutionContext): boolean {
    if (context.getType() === 'ws') {
      return true;
    }
    if (this.SKIP_RATE_LIMITTER) {
      return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const req = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const ip = `${req.ip}${req.path}`;

    console.log(ip);
    const now = Date.now();
    const entry = this.requests.get(ip);

    if (!entry) {
      // No record yet, create new
      this.requests.set(ip, { count: 1, lastRequestTime: now });
      return true;
    }

    // Check if TTL has expired since last request
    if (now - entry.lastRequestTime > this.TTL) {
      // Reset count and time
      this.requests.set(ip, { count: 1, lastRequestTime: now });
      return true;
    }

    // TTL not expired, increment count and check limit
    if (entry.count >= this.LIMIT) {
      // Too many requests
      throw new HttpException(
        'Too many requests. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Increment count and update lastRequestTime
    entry.count++;
    entry.lastRequestTime = now;
    this.requests.set(ip, entry);

    return true;
  }
}
