import { Module } from '@nestjs/common';
import { ClounidaryService } from './clounidary.service';

@Module({
  providers: [ClounidaryService],
  exports: [ClounidaryService],
})
export class ClounidaryModule {}
