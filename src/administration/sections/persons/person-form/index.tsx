import { WithId } from '#/backend/repositories/arango';
import { PersonBase } from '#/backend/repositories/content/person';
import { Button, ButtonGroup } from '#/ui/Button';
import { HiddenInput, SelectFormRow, TextFormRow } from '#/ui/Form';
import { Table } from '#/ui/Table';
import { ClientPersonForm, TeacherCodeSelector } from './form';

export const PersonForm = ({
  person,
}: {
  person: WithId<PersonBase> | null;
}) => {
  const mode = person === null ? 'create' : 'edit';

  const {
    teacherCode = null,
    lastname = '',
    firstname = '',
    type = 'student',
    gender = 'male',
  } = person ?? {};

  return (
    <ClientPersonForm personId={person?.id ?? null} mode={mode}>
      <HiddenInput name='id' value={person?.id} />
      <HiddenInput name='rev' value={person?.rev} />
      <Table>
        <TeacherCodeSelector
          mode={mode}
          defaultType={type}
          defaultLastname={lastname}
          defaultTeacherCode={teacherCode}
        >
          <>
            <TextFormRow
              label={`schulhof.administration.sections.persons.${mode}-person.form.firstname`}
              name='firstname'
              defaultValue={firstname}
            />
            <SelectFormRow
              label={`schulhof.administration.sections.persons.${mode}-person.form.gender`}
              name='gender'
              defaultValue={gender}
              values={{
                male: 'generic.genders.male',
                female: 'generic.genders.female',
                other: 'generic.genders.other',
              }}
            />
          </>
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
    </ClientPersonForm>
  );
};
