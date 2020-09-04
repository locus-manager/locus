import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { environment } from '../environments/environment';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceService } from './services/place.service';
import { UserService } from './services/user.service';
import { SessionService } from './services/session.service';
import { Place } from './entities/place.entity';
import { Session } from './entities/session.entity';
import { User } from './entities/user.entity';
import { PlaceController } from './place.controller';
import { UserController } from './user.controller';
import { SessionController } from './session.controller';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './services/tasks/tasks.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: environment.database,
      autoLoadEntities: true,
      synchronize: true,
      namingStrategy: new SnakeNamingStrategy(),
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Place, User, Session]),
  ],
  controllers: [
    AppController,
    PlaceController,
    UserController,
    SessionController,
  ],
  providers: [
    AppService,
    PlaceService,
    UserService,
    SessionService,
    TasksService,
  ],
})
export class AppModule {}
