import { CourseBase } from '#/backend/repositories/content/course';
import {
  CourseClassIdFilter,
  CourseIdFilter,
  CourseNameFilter,
} from '#/backend/repositories/content/course/filters';
import { IdNotFoundError } from '#/backend/repositories/errors';
import { AndFilter } from '#/backend/repositories/filters';
import {
  EqFilterOperator,
  NeqFilterOperator,
} from '#/backend/repositories/filters/operators';
import { MakePatch } from '#/backend/repositories/utils';
import { Validator } from '../base';
import { InputValidationError, aggregateValidationErrors } from '../utils';

export const CLASS_DOES_NOT_EXIST = 'CLASS_DOES_NOT_EXIST';
export const COURSE_NAME_INVALID = 'COURSE_NAME_INVALID';
export const COURSE_NAME_EXISTS = 'COURSE_NAME_EXISTS';
export const CANNOT_CHANGE_CLASS_ID = 'CANNOT_CHANGE_CLASS_ID';

export class CourseValidator extends Validator<'courses', CourseBase> {
  override async assertCanCreate(post: CourseBase): Promise<void | never> {
    await this.assertClassExists(post.classId);

    await aggregateValidationErrors([
      this.assertNameValid(post.classId, post.name),
    ]);
  }

  override async assertCanUpdate(
    id: string,
    patch: MakePatch<CourseBase>
  ): Promise<void | never> {
    const [base] = await this.repositories.course.getByIds([id]);

    if (!base) {
      throw new IdNotFoundError();
    }

    await aggregateValidationErrors([
      patch.name === undefined
        ? null
        : this.assertNameValid(base.classId, patch.name, id),
      patch.classId === undefined || patch.classId === base.classId
        ? null
        : this.throwValidationError(CANNOT_CHANGE_CLASS_ID),
    ]);
  }

  private async assertClassExists(classId: string): Promise<void | never> {
    const [clazz] = await this.repositories.class.getByIds([classId]);

    if (!clazz) {
      throw new InputValidationError(CLASS_DOES_NOT_EXIST);
    }
  }

  private async assertNameValid(
    classId: string,
    name: string,
    exceptId?: string
  ): Promise<void | never> {
    if (!name.length) {
      throw new InputValidationError(COURSE_NAME_INVALID);
    }

    await this.assertExistsNoneInClassWithName(classId, name, exceptId);
  }

  private async assertExistsNoneInClassWithName(
    classId: string,
    name: string,
    exceptId?: string
  ): Promise<void | never> {
    const course = await this.repositories.course.searchOne({
      filter: new AndFilter(
        new CourseNameFilter(new EqFilterOperator(name)),
        new CourseClassIdFilter(new EqFilterOperator(classId)),
        exceptId === undefined
          ? null
          : new CourseIdFilter(new NeqFilterOperator(exceptId))
      ),
      limit: 1,
    });

    if (course) {
      throw new InputValidationError(COURSE_NAME_EXISTS);
    }
  }
}
