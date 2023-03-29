import { WithId } from '#/repositories/arango';
import { LevelSchoolyearIdFilter } from '#/repositories/content/level/filters';
import { SchoolyearBase } from '#/repositories/content/schoolyear';
import { SchoolyearFilter } from '#/repositories/content/schoolyear/filters';
import {
  EqFilterOperator,
  InFilterOperator,
} from '#/repositories/filters/operators';
import { Service } from '../base';

export class SchoolyearService extends Service<'schoolyears', SchoolyearBase> {
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
