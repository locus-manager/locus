import { BeforeInsert, Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Place } from './place.entity';
import { v4 as uuidv4 } from 'uuid';


@Entity('session')
export class Session {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'timestamp', nullable: true, default: null })
  checkinDate: string;

  @Column({ type: 'timestamp', nullable: true, default: null })
  checkoutDate: string;

  @ManyToOne('Place', 'sessions', { eager: true })
  place: Place;

  @ManyToOne('User', 'sessions', { eager: true })
  user: User;

  @BeforeInsert()
  private beforeInsert() {
    this.id = uuidv4();
  }
}
