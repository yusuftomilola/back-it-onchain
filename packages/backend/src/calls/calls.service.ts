import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Call } from './call.entity';

@Injectable()
export class CallsService {
  constructor(
    @InjectRepository(Call)
    private callsRepository: Repository<Call>,
  ) { }

  async create(callData: Partial<Call>): Promise<Call> {
    const call = this.callsRepository.create(callData);
    return this.callsRepository.save(call);
  }

  async findAll(): Promise<Call[]> {
    return this.callsRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['creator']
    });
  }

  async findOne(id: number): Promise<Call | null> {
    return this.callsRepository.findOne({ where: { id } });
  }
}
