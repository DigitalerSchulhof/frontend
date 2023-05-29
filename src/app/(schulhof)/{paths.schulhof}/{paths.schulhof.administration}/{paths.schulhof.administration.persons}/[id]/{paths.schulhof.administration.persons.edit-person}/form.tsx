'use client';

import { T, useT } from '#/i18n';
import { Alert } from '#/ui/Alert';
import { Button, ButtonGroup } from '#/ui/Button';
import { Form, SelectFormRow, TextFormRow } from '#/ui/Form';
import { Modal } from '#/ui/Modal';
import { ErrorModal, LoadingModal } from '#/ui/Modal/client';
import { Table } from '#/ui/Table';
import { unwrapAction } from '#/utils/client';
import { useSend } from '#/utils/form';
import React, {
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { editPerson } from './action';
import {
  PersonGender,
  PersonType,
} from '#/backend/repositories/content/person';

export const EditPersonForm = ({
  personId,
  personRev,
  type,
  firstname,
  lastname,
  gender,
  teacherCode,
  teacherCodeSuggestion,
}: {
  personId: string;
  personRev: string;
  type: PersonType;
  firstname: string;
  lastname: string;
  gender: PersonGender;
  teacherCode: string | null;
  teacherCodeSuggestion: string;
}) => {
  const [typeState, setTypeState] = useState<PersonType>(type);
  const teacherCodeInputRef = useRef<{ value: string }>(null);

  const typeRef = useRef<{ value: PersonType }>(null);
  const firstnameRef = useRef<{ value: string }>(null);
  const lastnameRef = useRef<{ value: string }>(null);
  const genderRef = useRef<{ value: PersonGender }>(null);
  const teacherCodeRef = useRef<{ value: string | null }>(null);

  useImperativeHandle(teacherCodeRef, () => ({
    get value() {
      return type === 'teacher' ? teacherCodeInputRef.current!.value : null;
    },
  }));

  const [sendEditAccount, modal] = useSubmit(
    personId,
    personRev,
    typeRef,
    firstnameRef,
    lastnameRef,
    genderRef,
    teacherCodeRef
  );

  return (
    <Form onSubmit={sendEditAccount}>
      {modal}
      <Table>
        <SelectFormRow
          label='schulhof.administration.sections.persons.edit-person.form.type'
          defaultValue={type}
          ref={typeRef}
          onInput={setTypeState}
          values={
            {
              student: 'generic.person-types.student.singular',
              teacher: 'generic.person-types.teacher.singular',
              parent: 'generic.person-types.parent.singular',
              admin: 'generic.person-types.admin.singular',
              other: 'generic.person-types.other.singular',
            } as const
          }
        />
        <TextFormRow
          label='schulhof.administration.sections.persons.edit-person.form.firstname'
          defaultValue={firstname}
          ref={firstnameRef}
        />
        <TextFormRow
          label='schulhof.administration.sections.persons.edit-person.form.lastname'
          defaultValue={lastname}
          ref={lastnameRef}
        />
        <SelectFormRow
          label='schulhof.administration.sections.persons.edit-person.form.gender'
          defaultValue={gender}
          ref={genderRef}
          values={{
            male: 'generic.genders.male',
            female: 'generic.genders.female',
            other: 'generic.genders.other',
          }}
        />
        {typeState === 'teacher' && (
          <TextFormRow
            label='schulhof.administration.sections.persons.edit-person.form.teacher-code'
            defaultValue={teacherCode ?? teacherCodeSuggestion}
            ref={teacherCodeInputRef}
          />
        )}
      </Table>
      <ButtonGroup>
        <Button
          type='submit'
          variant='success'
          t='schulhof.administration.sections.persons.edit-person.form.buttons.save'
        />
        <Button
          href={[
            'paths.schulhof',
            'paths.schulhof.administration',
            'paths.schulhof.administration.persons',
            `{${personId}}`,
          ]}
          t={`schulhof.administration.sections.persons.edit-person.form.buttons.back`}
        />
      </ButtonGroup>
    </Form>
  );
};

function mapError(err: string) {
  switch (err) {
    case 'PERSON_FIRSTNAME_INVALID':
      return 'firstname-invalid';
    case 'PERSON_LASTNAME_INVALID':
      return 'lastname-invalid';
    default:
      return 'internal-error' as const;
  }
}

function useSubmit(
  personId: string,
  personRev: string,
  typeRef: React.RefObject<{ value: PersonType }>,
  firstnameRef: React.RefObject<{ value: string }>,
  lastnameRef: React.RefObject<{ value: string }>,
  genderRef: React.RefObject<{ value: PersonGender }>,
  teacherCodeRef: React.RefObject<{ value: string | null }>
) {
  const { t } = useT();

  return useSend(
    useCallback(
      () =>
        unwrapAction(
          editPerson(personId, personRev, {
            type: typeRef.current!.value,
            firstname: firstnameRef.current!.value,
            lastname: lastnameRef.current!.value,
            gender: genderRef.current!.value,
            teacherCode: teacherCodeRef.current!.value,
          })
        ),
      [
        personId,
        personRev,
        typeRef,
        firstnameRef,
        lastnameRef,
        genderRef,
        teacherCodeRef,
      ]
    ),
    useCallback(
      () => (
        <LoadingModal
          title='schulhof.administration.sections.persons.edit-person.modals.loading.title'
          description='schulhof.administration.sections.persons.edit-person.modals.loading.description'
        />
      ),
      []
    ),
    useCallback(
      (close, errors) => {
        const reasons = errors.flatMap((err) =>
          t(
            `schulhof.administration.sections.persons.edit-person.modals.error.reasons.${mapError(
              err
            )}`
          )
        );

        return (
          <ErrorModal
            close={close}
            title='schulhof.administration.sections.persons.edit-person.modals.error.title'
            description='schulhof.administration.sections.persons.edit-person.modals.error.description'
            reasons={reasons}
          />
        );
      },
      [t]
    ),
    useCallback(() => {
      return (
        <Modal onClose={close}>
          <Alert
            variant='success'
            title='schulhof.administration.sections.persons.edit-person.modals.success.title'
          >
            <p>
              <T t='schulhof.administration.sections.persons.edit-person.modals.success.description' />
            </p>
          </Alert>
          <ButtonGroup>
            <Button
              href={[
                'paths.schulhof',
                'paths.schulhof.administration',
                'paths.schulhof.administration.persons',
                `{${personId}}`,
              ]}
              t={`schulhof.administration.sections.persons.edit-person.modals.success.button`}
            />
          </ButtonGroup>
        </Modal>
      );
    }, [personId])
  );
}
