// common/repositories/base.repository.ts
import { Repository } from 'typeorm';

export abstract class BaseRepository<T> {
  protected constructor(protected readonly repository: Repository<T>) {}

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findOneById(id: number): Promise<T | null> {
    return this.repository.findOneBy({ id } as any);
  }

  async create(data: Partial<T> | Partial<T>[]): Promise<T | T[]> {
    const entity = this.repository.create(data as any);
    return this.repository.save(entity as any);
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    await this.repository.update(id, data as any);
    return this.findOneById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
