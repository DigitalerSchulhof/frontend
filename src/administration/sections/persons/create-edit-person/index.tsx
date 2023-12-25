import {
  PersonGender,
  PersonType,
  type Person,
} from '#/services/interfaces/person';
import { Button, ButtonGroup } from '#/ui/Button';
import { HiddenInput, SelectFormRow, TextFormRow } from '#/ui/Form';
import { Table } from '#/ui/Table';
import { ClientCreateEditPersonForm, TeacherCodeSelector } from './form';

export const CreateEditPersonForm = ({ person }: { person: Person | null }) => {
  const mode = person === null ? 'create' : 'edit';

  const {
    teacherCode = null,
    lastname = '',
    firstname = '',
    type = PersonType.Student,
    gender = PersonGender.Male,
  } = person ?? {};

  return (
    <ClientCreateEditPersonForm personId={person?.id ?? null} mode={mode}>
      <HiddenInput name='personId' value={person?.id} />
      <HiddenInput name='personRev' value={person?.rev} />
      <Table>
        <TeacherCodeSelector
          mode={mode}
          defaultType={
            (
              {
                [PersonType.Student]: 'student',
                [PersonType.Teacher]: 'teacher',
                [PersonType.Parent]: 'parent',
                [PersonType.Admin]: 'admin',
                [PersonType.Other]: 'other',
              } as const
            )[type]
          }
          defaultLastname={lastname}
          defaultTeacherCode={teacherCode}
        >
          <TextFormRow
            label={`schulhof.administration.sections.persons.${mode}-person.form.firstname`}
            name='firstname'
            defaultValue={firstname}
          />
          <SelectFormRow
            label={`schulhof.administration.sections.persons.${mode}-person.form.gender`}
            name='gender'
            defaultValue={
              (
                {
                  [PersonGender.Male]: 'male',
                  [PersonGender.Female]: 'female',
                  [PersonGender.Other]: 'other',
                } as const
              )[gender]
            }
            values={{
              male: 'generic.genders.male',
              female: 'generic.genders.female',
              other: 'generic.genders.other',
            }}
          />
        </TeacherCodeSelector>
      </Table>
      <ButtonGroup>
        <Button
          type='submit'
          variant='success'
          t={`schulhof.administration.sections.persons.${mode}-person.form.buttons.save`}
        />
        <Button
          href={
            person
              ? [
                  'paths.schulhof',
                  'paths.schulhof.administration',
                  'paths.schulhof.administration.persons',
                  `{${person.id}}`,
                ]
              : [
                  'paths.schulhof',
                  'paths.schulhof.administration',
                  'paths.schulhof.administration.persons',
                ]
          }
          t={`schulhof.administration.sections.persons.${mode}-person.form.buttons.back`}
        />
      </ButtonGroup>
    </ClientCreateEditPersonForm>
  );
};
