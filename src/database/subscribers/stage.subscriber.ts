import {
    EventSubscriber,
    EntitySubscriberInterface,
    InsertEvent,
  } from 'typeorm';
  import { Stage } from '../entities/stage.entity'; // Adjust the import path to your Stage entity
  
  @EventSubscriber()
  export class StageSubscriber implements EntitySubscriberInterface<Stage> {
   
    listenTo() {
      return Stage;
    }

    async beforeInsert(event: InsertEvent<Stage>) {
      if (event.entity.order) {
        return;
      }
  
      const queryRunner = event.queryRunner;
  
      const result = await queryRunner.manager
        .createQueryBuilder(Stage, 'stage')
        .select('MAX(stage.order)', 'maxOrder')
        .getRawOne();
  
      const nextOrder = (result && result.maxOrder !== null) ? result.maxOrder + 1 : 1;
      event.entity.order = nextOrder;
    }
  }