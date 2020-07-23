import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Session } from './session.entity';
import { v4 as uuidv4 } from 'uuid';

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

  @BeforeInsert()
  private beforeInsert() {
    this.id = uuidv4();
  }
}
