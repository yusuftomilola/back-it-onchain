import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, ChainType } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async validateUser(wallet: string, chain: ChainType = 'base'): Promise<User> {
    let user = await this.usersRepository.findOne({ where: { wallet } });
    if (!user) {
      user = this.usersRepository.create({ wallet, chain });
      await this.usersRepository.save(user);
    } else if (user.chain !== chain) {
      // Update chain if user switches chains
      user.chain = chain;
      await this.usersRepository.save(user);
    }
    return user;
  }
}
