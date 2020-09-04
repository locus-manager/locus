import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Session } from '../entities/session.entity';
import { SessionDto } from '../models/session.dto';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment-timezone';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    private userService: UserService
  ) {}

  findAll(): Promise<Session[]> {
    return this.sessionRepository.find();
  }

  findActiveCheckin(email: string, placeId: string): Promise<Session[]> {
    return this.sessionRepository
      .createQueryBuilder('session')
      .leftJoinAndSelect(
        'session.place',
        'place',
        'place.id = session.place_id'
      )
      .select()
      .innerJoin(User, 'user', 'user.id = session.user_id')
      .where('user.email = :email', { email })
      .andWhere('place_id = :placeId', { placeId })
      .andWhere('session.checkout_date is null')
      .getMany();
  }

  closeOldSessions(): Promise<UpdateResult> {
    const currentDate = moment().tz('America/Sao_Paulo');
    const checkoutDate = moment()
      .tz('America/Sao_Paulo')
      .subtract(1, 'day')
      .set({
        hour: 23,
        minutes: 59,
        seconds: 59,
      });

    return this.sessionRepository
      .createQueryBuilder()
      .update()
      .set({ checkoutDate: checkoutDate.format() })
      .where('checkoutDate is null and checkinDate < :currentDate', {
        currentDate: currentDate.format('YYYY-MM-DD'),
      })
      .execute();
  }

  async save(session: SessionDto): Promise<Session[] | UpdateResult[]> {
    const { name, email, phone, type, code, checkin } = session;
    const user = await this.userService.save({ name, email, phone } as User);
    const currentDate = new Date();

    switch (type) {
      case 'checkin':
        // Must close the previous session setting current time
        await this.sessionRepository.update(
          { user: { id: user.id }, checkoutDate: null },
          { checkoutDate: currentDate.toISOString() }
        );

        return await this.sessionRepository.save([
          {
            id: uuidv4(),
            user: { id: user.id },
            place: { id: code },
            checkinDate: currentDate.toISOString(),
          },
        ]);
      case 'checkout':
        const datesToBeUpdated: {
          checkinDate?: string;
          checkoutDate?: string;
        } = {};

        datesToBeUpdated.checkoutDate = currentDate.toISOString();
        if (checkin) {
          const [hour, minutes] = checkin.split(':');
          currentDate.setHours(Number(hour));
          currentDate.setMinutes(Number(minutes));
          datesToBeUpdated.checkinDate = currentDate.toISOString();
        }

        const openSessions = await this.sessionRepository.find({
          where: { user: { id: user.id }, checkoutDate: null },
          order: { checkinDate: 'DESC' },
        });

        const newEntity = {
          id: uuidv4(),
          user: { id: user.id },
          place: { id: code },
          ...datesToBeUpdated,
        };

        const arraySession =
          openSessions.length > 0 && openSessions[0].place.id === code
            ? [{ ...openSessions[0], ...datesToBeUpdated }]
            : openSessions.length > 0 && openSessions[0].place.id !== code
            ? [
                {
                  ...openSessions[0],
                  checkoutDate: datesToBeUpdated.checkoutDate,
                },
                newEntity,
              ]
            : [newEntity];

        return await this.sessionRepository.save(arraySession);
    }
  }
}
