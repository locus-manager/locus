import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SessionService } from '../session.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private sessionService: SessionService) {}

  @Cron(CronExpression.EVERY_HOUR)
  closeOldSessions() {
    this.sessionService.closeOldSessions();
    this.logger.debug('Old Sessions Invalidated');
  }
}
