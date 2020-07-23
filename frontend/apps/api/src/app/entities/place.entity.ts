import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn
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

  @BeforeInsert()
  private beforeInsert() {
    this.id = uuidv4();
  }

}
