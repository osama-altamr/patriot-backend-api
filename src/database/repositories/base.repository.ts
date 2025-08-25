// common/repositories/base.repository.ts
import { FindManyOptions, Repository } from 'typeorm'

export abstract class BaseRepository<T> {
  public readonly repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  async findAll({ filter }: { filter?: FindManyOptions<T> }): Promise<T[]> {
    return this.repository.find(filter)
  }

  async findOneById(id: string): Promise<T | null> {
    return this.repository.findOneBy({ id } as any)
  }

  async findOneBy(query: object): Promise<T | null> {
    return await this.repository.findOne({
      where: {
        ...query,
      },
    })
  }

  async findBy(query: object): Promise<T[] | null> {
    return await this.repository.find({
      where: {
        ...query,
      },
    })
  }

  async findByIds(ids: string[]): Promise<T[]> {
    return this.repository.findByIds(ids);
  }

  async create(data: Partial<T> | Partial<T>[]): Promise<T | T[]> {
    const entity = this.repository.create(data as any)
    return this.repository.save(entity as any)
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    await this.repository.update(id, data as any)
    return await this.findOneById(id)
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id)
  }

  async count(query?: object) {
    return await this.repository.count(query)  
  }
}
