'use client';

import { T, useT } from '#/i18n';
import type { PersonType } from '#/services/interfaces/person';
import { Alert } from '#/ui/Alert';
import { Button, ButtonGroup } from '#/ui/Button';
import { Form, SelectFormRow, TextFormRow } from '#/ui/Form';
import { Modal } from '#/ui/Modal';
import { ErrorModal, LoadingModal } from '#/ui/Modal/client';
import { unwrapAction } from '#/utils/client';
import { useSend } from '#/utils/form';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import action, { generateTeacherCode } from './action';

export const ClientPersonForm = ({
  personId,
  mode,
  children,
}: {
  personId: string | null;
  mode: 'create' | 'edit';
  children: React.ReactNode;
}) => {
  // TODO: Warn on duplicate name
  const submit = useSubmit(personId, mode);

  return <Form submit={submit}>{children}</Form>;
};

function useSubmit(personId: string | null, mode: 'create' | 'edit') {
  const { t } = useT();

  return useSend(
    action,
    useCallback(
      () => (
        <LoadingModal
          title={`schulhof.administration.sections.persons.${mode}-person.modals.loading.title`}
          description={`schulhof.administration.sections.persons.${mode}-person.modals.loading.description`}
        />
      ),
      [mode]
    ),
    useCallback(
      (close, errors) => {
        const reasons = errors.flatMap((err) =>
          t(
            `schulhof.administration.sections.persons.${mode}-person.modals.error.reasons.${mapError(
              err
            )}`
          )
        );

        return (
          <ErrorModal
            close={close}
            title={`schulhof.administration.sections.persons.${mode}-person.modals.error.title`}
            description={`schulhof.administration.sections.persons.${mode}-person.modals.error.description`}
            reasons={reasons}
          />
        );
      },
      [t, mode]
    ),
    useCallback(() => {
      return (
        <Modal onClose={close}>
          <Alert
            variant='success'
            title={`schulhof.administration.sections.persons.${mode}-person.modals.success.title`}
          >
            <p>
              <T
                t={`schulhof.administration.sections.persons.${mode}-person.modals.success.description`}
              />
            </p>
          </Alert>
          <ButtonGroup>
            <Button
              href={
                personId
                  ? [
                      'paths.schulhof',
                      'paths.schulhof.administration',
                      'paths.schulhof.administration.persons',
                      `{${personId}}`,
                    ]
                  : [
                      'paths.schulhof',
                      'paths.schulhof.administration',
                      'paths.schulhof.administration.persons',
                    ]
              }
              t={`schulhof.administration.sections.persons.${mode}-person.modals.success.button`}
            />
          </ButtonGroup>
        </Modal>
      );
    }, [personId, mode])
  );
}

function mapError(err: string) {
  switch (err) {
    case 'PERSON_FIRSTNAME_INVALID':
      return 'firstname-invalid';
    case 'PERSON_LASTNAME_INVALID':
      return 'lastname-invalid';
    default:
      return 'internal-error';
  }
}

export const TeacherCodeSelector = ({
  mode,
  defaultType,
  defaultLastname,
  defaultTeacherCode,
  children,
}: {
  mode: 'create' | 'edit';
  defaultType: PersonType;
  defaultLastname: string;
  defaultTeacherCode: string | null;
  children: React.ReactNode;
}) => {
  const [typeState, setTypeState] = useState(defaultType);
  const [lastnameState, setLastnameState] = useState(defaultLastname);
  const teacherCodeInputRef = useRef<{ value: string }>(null);

  const typeRef = useRef<{ value: PersonType }>(null);
  const lastnameRef = useRef<{ value: string }>(null);

  const teacherCodeSuggestion = useTeacherCodeSuggestion(
    typeState,
    lastnameState
  );

  return (
    <>
      <SelectFormRow
        label={`schulhof.administration.sections.persons.${mode}-person.form.type`}
        name='type'
        defaultValue={defaultType}
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
      {children}
      <TextFormRow
        label={`schulhof.administration.sections.persons.${mode}-person.form.lastname`}
        name='lastname'
        defaultValue={defaultLastname}
        ref={lastnameRef}
        onInput={setLastnameState}
      />
      {typeState === 'teacher' && (
        <TextFormRow
          label={`schulhof.administration.sections.persons.${mode}-person.form.teacher-code`}
          name='teacherCode'
          defaultValue={defaultTeacherCode ?? ''}
          placeholder={teacherCodeSuggestion ?? undefined}
          ref={teacherCodeInputRef}
        />
      )}
    </>
  );
};

function useTeacherCodeSuggestion(type: PersonType, lastname: string) {
  const [teacherCodeSuggestion, setTeacherCodeSuggestion] = useState<
    string | null
  >(null);

  const lastnameFirstThree = lastname.substring(0, 3).toUpperCase();

  useEffect(() => {
    let mounted = true as boolean;

    if (type === 'teacher') {
      void (async () => {
        const teacherCode = await unwrapAction(
          generateTeacherCode(lastnameFirstThree)
        );

        if (mounted) {
          setTeacherCodeSuggestion(teacherCode);
        }
      })();
    } else {
      setTeacherCodeSuggestion(null);
    }

    return () => {
      mounted = false;
    };
  }, [type, lastnameFirstThree]);

  return teacherCodeSuggestion;
}
