'use client';

import {
  PersonGender,
  PersonType,
} from '#/backend/repositories/content/person';
import { T, useT } from '#/i18n';
import { Alert } from '#/ui/Alert';
import { Button, ButtonGroup } from '#/ui/Button';
import { Form, SelectFormRow, TextFormRow } from '#/ui/Form';
import { Modal } from '#/ui/Modal';
import { ErrorModal, LoadingModal } from '#/ui/Modal/client';
import { Table } from '#/ui/Table';
import { unwrapAction } from '#/utils/client';
import { useSend } from '#/utils/form';
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import action, { generateTeacherCode } from './action';

export type PersonFormPerson = {
  id: string;
  rev: string;
  type: PersonType;
  firstname: string;
  lastname: string;
  gender: PersonGender;
  teacherCode: string | null;
};

export const PersonForm = ({ person }: { person: PersonFormPerson | null }) => {
  const mode = person === null ? 'create' : 'edit';

  const {
    teacherCode = null,
    lastname = '',
    firstname = '',
    type = 'student',
    gender = 'male',
  } = person ?? {};

  const [typeState, setTypeState] = useState(type);
  const [lastnameState, setLastnameState] = useState(lastname);
  const teacherCodeInputRef = useRef<{ value: string }>(null);

  const typeRef = useRef<{ value: PersonType }>(null);
  const firstnameRef = useRef<{ value: string }>(null);
  const lastnameRef = useRef<{ value: string }>(null);
  const genderRef = useRef<{ value: PersonGender }>(null);
  const teacherCodeRef = useRef<{ value: string | null }>(null);

  useImperativeHandle(
    teacherCodeRef,
    () => ({
      get value() {
        return typeState === 'teacher'
          ? teacherCodeInputRef.current!.value
          : null;
      },
    }),
    [typeState]
  );

  const teacherCodeSuggestion = useTeacherCodeSuggestion();

  // TODO: Warn on duplicate name
  const [sendEditAccount, modal] = useSubmit();

  return (
    <Form onSubmit={sendEditAccount}>
      {modal}
      <Table>
        <SelectFormRow
          label={`schulhof.administration.sections.persons.${mode}-person.form.type`}
          defaultValue={typeState}
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
          label={`schulhof.administration.sections.persons.${mode}-person.form.firstname`}
          defaultValue={firstname}
          ref={firstnameRef}
        />
        <TextFormRow
          label={`schulhof.administration.sections.persons.${mode}-person.form.lastname`}
          defaultValue={lastname}
          ref={lastnameRef}
          onInput={setLastnameState}
        />
        <SelectFormRow
          label={`schulhof.administration.sections.persons.${mode}-person.form.gender`}
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
            label={`schulhof.administration.sections.persons.${mode}-person.form.teacher-code`}
            defaultValue={teacherCode ?? ''}
            placeholder={teacherCodeSuggestion ?? undefined}
            ref={teacherCodeInputRef}
          />
        )}
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
    </Form>
  );

  function useTeacherCodeSuggestion() {
    // TODO: Generate on demand
    const [teacherCodeSuggestion, setTeacherCodeSuggestion] = useState<
      string | null
    >(null);

    useEffect(() => {
      let mounted = true as boolean;

      if (typeState === 'teacher') {
        void (async () => {
          const teacherCode = await unwrapAction(
            generateTeacherCode(lastnameState)
          );

          if (mounted) {
            setTeacherCodeSuggestion(teacherCode);
          }
        })();
      }

      return () => {
        mounted = false;
      };
    }, [typeState, lastnameState]);

    return teacherCodeSuggestion;
  }

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

  function useSubmit() {
    const { t } = useT();

    return useSend(
      useCallback(
        () =>
          unwrapAction(
            action(person?.id ?? null, person?.rev ?? null, {
              type: typeRef.current!.value,
              firstname: firstnameRef.current!.value,
              lastname: lastnameRef.current!.value,
              gender: genderRef.current!.value,
              teacherCode: teacherCodeRef.current!.value,
            })
          ),
        [person, typeRef, firstnameRef, lastnameRef, genderRef, teacherCodeRef]
      ),
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
                t={`schulhof.administration.sections.persons.${mode}-person.modals.success.button`}
              />
            </ButtonGroup>
          </Modal>
        );
      }, [person, mode])
    );
  }
};
