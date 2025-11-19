import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class IndexerService implements OnModuleInit {
  private provider: ethers.JsonRpcProvider;

  constructor(private configService: ConfigService) {
    const rpcUrl = this.configService.get<string>('BASE_SEPOLIA_RPC_URL');
    if (rpcUrl) {
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
    }
  }

  onModuleInit() {
    if (this.provider) {
      this.startListening();
    }
  }

  startListening() {
    console.log('Starting indexer...');
    // Placeholder for event listening
    // this.provider.on(filter, (log) => { ... });
  }
}
