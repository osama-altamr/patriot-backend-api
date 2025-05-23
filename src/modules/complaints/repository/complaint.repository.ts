import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository, Complaint } from '../../../database';

@Injectable()
export class ComplaintRepository extends BaseRepository<Complaint> {
  constructor(
    @InjectRepository(Complaint)
    repository: Repository<Complaint>,
  ) {
    super(repository);
  }
  async findOneByWithPop(query: object) {
    return await this.repository.findOne({
      where: {
        ...query,
      },
      relations: ['closedBy', 'user'],
    })
  }
}
