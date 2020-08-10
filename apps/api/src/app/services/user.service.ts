import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findByFilter(user: Partial<User>) {
    return this.userRepository.find({ where: { ...user } });
  }

  async save(user: User) {
    const { email } = user;
    const existingUser = await this.userRepository.findOne({ email });
    user.id = user.id || uuidv4();

    return existingUser || this.userRepository.save(user);
  }
}
