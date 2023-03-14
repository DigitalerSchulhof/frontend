import { WithId } from '#/repositories/arango';
import { ClassLevelIdFilter } from '#/repositories/content/class/filters';
import { LevelBase } from '#/repositories/content/level';
import { LevelFilter } from '#/repositories/content/level/filters';
import {
  EqFilterOperator,
  InFilterOperator,
} from '#/repositories/filters/operators';
import { Service } from '#/services/base';

export class LevelService extends Service<'levels', LevelBase> {
  override async delete(
    id: string,
    ifRev?: string | undefined
  ): Promise<WithId<LevelBase>> {
    const res = await super.delete(id, ifRev);

    await this.services.class.filterDelete(
      new ClassLevelIdFilter(new EqFilterOperator(id))
    );

    return res;
  }

  override async filterDelete(
    filter: LevelFilter
  ): Promise<WithId<LevelBase>[]> {
    const res = await super.filterDelete(filter);

    const classIds = res.map((r) => r.id);

    await this.services.class.filterDelete(
      new ClassLevelIdFilter(new InFilterOperator(classIds))
    );

    return res;
  }
}
