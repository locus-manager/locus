import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Session } from './session.entity';

@Entity()
export class User {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @OneToMany('Session', 'user')
  sessions: Session[];
}
