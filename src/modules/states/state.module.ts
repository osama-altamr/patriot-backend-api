import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { State } from 'src/database';
import { StateController } from './api/controllers/state.controller';
import { StateRepository } from './repository/state.repository';
import { StateService } from './services/state.service';
import { GetAllStatesValidation } from './api/validation/get-all.pipe';

@Module({
  imports: [TypeOrmModule.forFeature([State])],
  controllers: [StateController],
  providers: [StateService, StateRepository, GetAllStatesValidation],
  exports: [StateService, StateRepository],
})

export class StateModule {}