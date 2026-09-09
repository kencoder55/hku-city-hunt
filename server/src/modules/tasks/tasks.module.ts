import { Module } from '@nestjs/common';
import { MissionRecordsModule } from '../mission-records/mission-records.module';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [MissionRecordsModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
