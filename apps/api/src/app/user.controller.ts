import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { AppService } from './app.service';
import { PlaceService } from './services/place.service';
import { Session } from './entities/session.entity';
import { SessionService } from './services/session.service';
import { UserService } from './services/user.service';
import { User } from './entities/user.entity';

@Controller()
export class UserController {
  constructor(
    private readonly appService: AppService,
    private userService: UserService
  ) {}

  @Post()
  create(@Body() user: User) {
    this.userService.save(user);
  }
}
