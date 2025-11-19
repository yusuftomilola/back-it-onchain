import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IndexerService } from './indexer.service';

@Module({
  imports: [ConfigModule],
  providers: [IndexerService],
})
export class IndexerModule {}
