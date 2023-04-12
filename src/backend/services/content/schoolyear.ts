import { WithId } from '#/backend/repositories/arango';
import { LevelSchoolyearIdFilter } from '#/backend/repositories/content/level/filters';
import {
  SchoolyearBase,
  SchoolyearRepository,
} from '#/backend/repositories/content/schoolyear';
import { SchoolyearFilter } from '#/backend/repositories/content/schoolyear/filters';
import {
  EqFilterOperator,
  InFilterOperator,
} from '#/backend/repositories/filters/operators';
import { Service } from '../base';

export class SchoolyearService extends Service<
  'schoolyears',
  SchoolyearBase,
  SchoolyearRepository
> {
  override async delete(
    id: string,
    ifRev?: string | undefined
  ): Promise<WithId<SchoolyearBase>> {
    const res = await super.delete(id, ifRev);

    await this.services.level.filterDelete(
      new LevelSchoolyearIdFilter(new EqFilterOperator(id))
    );

    return res;
  }

  override async filterDelete(
    filter: SchoolyearFilter
  ): Promise<WithId<SchoolyearBase>[]> {
    const res = await super.filterDelete(filter);

    const schoolyearIds = res.map((r) => r.id);

    await this.services.level.filterDelete(
      new LevelSchoolyearIdFilter(new InFilterOperator(schoolyearIds))
    );

    return res;
  }
}
