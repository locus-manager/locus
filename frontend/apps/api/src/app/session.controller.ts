import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { AppService } from './app.service';
import { Session } from './entities/session.entity';
import { SessionService } from './services/session.service';
import { SessionDto } from './models/session.dto';
import { UpdateResult } from 'typeorm';

@Controller('sessions')
export class SessionController {
  constructor(
    private readonly appService: AppService,
    private sessionService: SessionService
  ) {}

  @Get(':email&:placeId')
  getActiveCheckin(@Param('email') email: string, @Param('placeId') placeId: string): Promise<Session[]> {
    return this.sessionService.findActiveCheckin(email, placeId);
  }

  @Post()
  createSession(@Body() session: SessionDto): Promise<Session[] | UpdateResult[]> {
    return this.sessionService.save(session);
  }
}
