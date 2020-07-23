import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Place } from '../entities/place.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PlaceService {
  constructor(
    @InjectRepository(Place)
    private placeRepository: Repository<Place>
  ) {}

  findAll(): Promise<Place[]> {
    return this.placeRepository.find();
  }

  findById(id: string): Promise<Place> {
    return this.placeRepository.findOne({ where: { id } });
  }

  save(place: Place): Promise<Place> {
    place.id = place.id || uuidv4();
    return this.placeRepository.save(place)
  }
}
