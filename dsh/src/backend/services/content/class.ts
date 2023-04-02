import { WithId } from '#/backend/repositories/arango';
import { ClassBase } from '#/backend/repositories/content/class';
import { ClassFilter } from '#/backend/repositories/content/class/filters';
import { CourseClassIdFilter } from '#/backend/repositories/content/course/filters';
import {
  EqFilterOperator,
  InFilterOperator,
} from '#/backend/repositories/filters/operators';
import { Service } from '../base';

export class ClassService extends Service<'classes', ClassBase> {
  override async delete(
    id: string,
    ifRev?: string | undefined
  ): Promise<WithId<ClassBase>> {
    const res = await super.delete(id, ifRev);

    await this.services.course.filterDelete(
      new CourseClassIdFilter(new EqFilterOperator(id))
    );

    return res;
  }

  override async filterDelete(
    filter: ClassFilter
  ): Promise<WithId<ClassBase>[]> {
    const res = await super.filterDelete(filter);

    const classIds = res.map((r) => r.id);

    await this.services.course.filterDelete(
      new CourseClassIdFilter(new InFilterOperator(classIds))
    );

    return res;
  }
}
