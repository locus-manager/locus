import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Place } from '../entities/place.entity';
import { v4 as uuidv4 } from 'uuid';
import { GenericFilterDto, mapQuery } from '../common/generic-filter.dto';

@Injectable()
export class PlaceService {
  constructor(
    @InjectRepository(Place)
    private placeRepository: Repository<Place>
  ) {}

  find(filter?: GenericFilterDto<Place>): Promise<Place[]> {
    const elasticSearchAttrs = ['name', 'location', 'name', 'sector', 'floor'];
    return this.placeRepository.find(mapQuery(filter, elasticSearchAttrs));
  }

  findById(id: string): Promise<Place> {
    return this.placeRepository.findOne({ where: { id } });
  }

  findByLocation(location: string): Promise<Place[]> {
    return this.placeRepository.find({
      where: { location },
      order: { location: 'ASC', floor: 'ASC', sector: 'ASC', name: 'ASC' },
    });
  }

  save(places: Place[]): Promise<Place[]> {
    const list = places.map((place) => ({
      ...place,
      id: place.id || uuidv4(),
    }));
    return this.placeRepository.save(list);
  }

  delete(ids: string[]): Promise<DeleteResult> {
    return this.placeRepository.delete(ids);
  }
}
