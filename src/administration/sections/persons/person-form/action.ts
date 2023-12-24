'use server';

import { requireLogin } from '#/auth/action';
import { PersonGender, PersonType } from '#/services/interfaces/person';
import { assertClient, wrapAction, wrapFormAction } from '#/utils/action';
import { v } from 'vality';

export type ClientPersonType =
  | 'student'
  | 'teacher'
  | 'parent'
  | 'admin'
  | 'other';
export type ClientGender = 'male' | 'female' | 'other';

export default wrapFormAction(
  {
    personId: v.string,
    personRev: v.string,
    firstname: v.string,
    lastname: v.string,
    type: ['student', 'teacher', 'parent', 'admin', 'other'],
    gender: ['male', 'female', 'other'],
    teacherCode: [v.string, null],
  },
  async ({
    personId,
    personRev,
    firstname,
    lastname,
    type,
    gender,
    teacherCode,
  }): Promise<void> => {
    const context = await requireLogin();

    const data = {
      firstname,
      lastname,
      type: {
        student: PersonType.Student,
        teacher: PersonType.Teacher,
        parent: PersonType.Parent,
        admin: PersonType.Admin,
        other: PersonType.Other,
      }[type],
      gender: {
        male: PersonGender.Male,
        female: PersonGender.Female,
        other: PersonGender.Other,
      }[gender],
      teacherCode: type === 'teacher' ? teacherCode : null,
    };

    if (personId) {
      assertClient(personRev);

      await context.services.person.updatePerson(personId, personRev, data);
    } else {
      await context.services.person.createPerson(data);
    }
  }
);

export const generateTeacherCode = wrapAction(
  [v.string],
  async (lastnameFirstThree) => {
    const context = await requireLogin();

    return context.services.person.generateTeacherCodeSuggestion(
      lastnameFirstThree
    );
  }
);
