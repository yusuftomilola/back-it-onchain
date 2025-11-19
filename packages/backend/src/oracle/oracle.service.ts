import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class OracleService {
  private signer: ethers.Wallet;

  constructor(private configService: ConfigService) {
    const privateKey = this.configService.get<string>('ORACLE_PRIVATE_KEY');
    if (privateKey) {
      this.signer = new ethers.Wallet(privateKey);
    }
  }

  async fetchPrice(tokenAddress: string): Promise<number> {
    // Placeholder for DexScreener API call
    console.log(`Fetching price for ${tokenAddress}`);
    // const response = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`);
    // return response.data.pairs[0].priceUsd;
    return Promise.resolve(1000); // Mock price
  }

  async signOutcome(
    callId: number,
    outcome: boolean,
    finalPrice: number,
    timestamp: number,
  ) {
    if (!this.signer) throw new Error('Oracle signer not configured');

    const domain = {
      name: 'OnChainSageOutcome',
      version: '1',
      chainId: 84532, // Base Sepolia
      verifyingContract: this.configService.get<string>(
        'OUTCOME_MANAGER_ADDRESS',
      ),
    };

    const types = {
      Outcome: [
        { name: 'callId', type: 'uint256' },
        { name: 'outcome', type: 'bool' },
        { name: 'finalPrice', type: 'uint256' },
        { name: 'timestamp', type: 'uint256' },
      ],
    };

    const value = {
      callId,
      outcome,
      finalPrice,
      timestamp,
    };

    return this.signer.signTypedData(domain, types, value);
  }
}
