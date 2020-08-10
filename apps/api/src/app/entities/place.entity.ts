import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Session } from './session.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Place {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  location: string;

  @Column()
  name: string;

  @Column()
  sector: string;

  @Column()
  floor: string;

  @OneToMany('Session', 'place')
  sessions: Session[];
}
