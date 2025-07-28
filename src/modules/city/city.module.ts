import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from 'src/database';
import { CityController } from './api/controllers/city.controller';
import { CityService } from './services/city.service';
import { CityRepository } from './repository/city.repository';
import { StateModule } from '/states/state.module';

@Module({
  imports: [TypeOrmModule.forFeature([City]), StateModule],
  controllers: [CityController],
  providers: [CityService, CityRepository],
  exports: [CityService, CityRepository],
})

export class CityModule {}