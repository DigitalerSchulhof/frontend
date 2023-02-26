import { ObjectCache } from '@caches/object-cache';
import { SchoolyearRepository } from '@repositories/schoolyear';
import { MakePatch, Paginated } from '@repositories/utils';
import { getByIdsCachedOrLoad } from './utils';

export interface Schoolyear {
  id: string;
  rev: string;
  name: string;
  start: number;
  end: number;
}

export interface SchoolyearInput {
  name: string;
  start: number;
  end: number;
}

export class SchoolyearService {
  constructor(
    private readonly repository: SchoolyearRepository,
    private readonly cache: ObjectCache<Schoolyear>
  ) {}

  async getById(id: string): Promise<Schoolyear | null> {
    return (await this.getByIds([id]))[0];
  }

  async getByIds(ids: readonly string[]): Promise<(Schoolyear | null)[]> {
    return getByIdsCachedOrLoad(this.cache, this.repository, ids);
  }

  async getAll(): Promise<Paginated<Schoolyear>> {
    return this.repository.getAll();
  }

  async create(post: SchoolyearInput): Promise<Schoolyear> {
    return this.repository.create(post);
  }

  async update(
    id: string,
    patch: MakePatch<SchoolyearInput>,
    ifRev?: string
  ): Promise<Schoolyear> {
    return this.repository.update(id, patch, ifRev);
  }

  async delete(id: string, ifRev?: string): Promise<Schoolyear> {
    return this.repository.delete(id, ifRev);
  }
}
