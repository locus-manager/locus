import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Session } from '../entities/session.entity';
import { SessionDto } from '../models/session.dto';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';

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

  findActiveCheckin(email: string): Promise<Session[]> {
    return this.sessionRepository
      .createQueryBuilder('session')
      .select()
      .innerJoin(User, 'user', 'user.id = session.user_id')
      .where('user.email = :email', { email })
      .andWhere('session.checkout_date is null')
      .getMany();
  }

  async save(session: SessionDto): Promise<Session | UpdateResult> {
    const { name, email, phone, type, code, checkin } = session;
    const user = await this.userService.save(<User>{ name, email, phone });
    const currentDate = new Date();

    switch (type) {
      case 'checkin':
        // Must close the previous session setting current time
        await this.sessionRepository.update(
          { user: { id: user.id }, checkoutDate: null },
          { checkoutDate: currentDate.toISOString() }
        );

        return await this.sessionRepository.save({
          user: { id: user.id },
          place: { id: code },
          checkinDate: currentDate.toISOString(),
        });
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

        return openSessions.length > 0
          ? await this.sessionRepository.save({
              ...openSessions[0],
              ...datesToBeUpdated,
            })
          : await this.sessionRepository.save({
              user: { id: user.id },
              place: { id: code },
              ...datesToBeUpdated,
            });
    }
  }
}
