import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Session } from './session.entity';

@Entity()
export class Place {
  @PrimaryGeneratedColumn('uuid')
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
