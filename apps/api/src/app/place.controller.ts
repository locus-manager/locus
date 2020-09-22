import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Render,
} from '@nestjs/common';

import { AppService } from './app.service';
import { PlaceService } from './services/place.service';
import { Place } from './entities/place.entity';
import QRCode from 'qrcode';
import { environment } from '../environments/environment';

@Controller('places')
export class PlaceController {
  constructor(
    private readonly appService: AppService,
    private placeService: PlaceService
  ) {}

  @Get()
  getPlaces(@Query() filter: { location: string }) {
    return this.placeService.find(filter);
  }

  @Get('codes/:location')
  @Render('index')
  async getQrCodesByLocation(@Param('location') location: string) {
    const result = await this.placeService.findByLocation(location);
    const places = await Promise.all(
      result.map(async (place) => {
        const qrCode = await QRCode.toDataURL(
          `${environment.apiUrl}/register?code=${place.id}`,
          { width: 500 }
        );

        return { ...place, qrCode };
      })
    );

    return { places };
  }

  @Get('code/:code')
  @Render('index')
  async getQrCode(@Param('code') code: string) {
    const place = await this.placeService.findById(code);

    const qrCode = await QRCode.toDataURL(
      `${environment.apiUrl}/register?code=${place.id}`,
      { width: 500 }
    );

    return { places: [{ ...place, qrCode }] };
  }

  @Get(':code')
  getPlace(@Param('code') code: string) {
    return this.placeService.findById(code);
  }

  @Post()
  createPlace(@Body() place: Place) {
    return this.placeService.save([place]);
  }

  @Post('import')
  createPlaces(@Body() places: Place[]) {
    return this.placeService.save(places);
  }

  @Delete()
  deletePlaces(@Body() ids: string[]) {
    if (!ids || !ids[0]) {
      throw new HttpException(
        'Select at least one place',
        HttpStatus.BAD_REQUEST
      );
    }

    return this.placeService.delete(ids);
  }
}
