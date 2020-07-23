import { Body, Controller, Get, Param, Post, Render } from '@nestjs/common';

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
  getPlaces() {
    return this.placeService.findAll();
  }

  @Get('codes')
  @Render('index')
  async getQrCodes() {
    const result = await this.placeService.findAll();

    const places = await Promise.all(
      result.map(async (place) => {
        const qrCode = await QRCode.toDataURL(
          `${environment.apiUrl}/register?code=${place.id}`
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
      `${environment.apiUrl}/register?code=${place.id}`
    );

    return { ...place, qrCode };
  }

  @Get(':code')
  getPlace(@Param('code') code: string) {
    return this.placeService.findById(code);
  }

  @Post()
  createPlace(@Body() place: Place) {
    return this.placeService.save(place);
  }
}
