import { ArangoRepository, WithId } from '../../arango';
import { MakeSearchQuery } from '../../search';
import { MakePatch } from '../../utils';
import { ClassFilter } from './filters';

export type ClassBase = {
  name: string;
  levelId: string;
};

export type Class = WithId<ClassBase>;

export type ClassPatch = MakePatch<ClassBase>;

export type ClassSearchQuery = MakeSearchQuery<Class, ClassFilter>;

export class ClassRepository extends ArangoRepository<
  Class,
  ClassBase,
  ClassPatch,
  ClassFilter,
  ClassSearchQuery
> {
  protected readonly collectionName = 'classes';
}
