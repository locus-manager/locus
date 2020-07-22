import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

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

    return existingUser || this.userRepository.save(user);
  }
}
