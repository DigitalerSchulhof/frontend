'use client';

import { T, useT } from '#/i18n';
import { Button, ButtonGroup, IconButton } from '#/ui/Button';
import { Label } from '#/ui/Form';
import { Heading } from '#/ui/Heading';
import {
  IconPersonActionCreateAccount,
  IconPersonActionDeleteAccount,
  IconPersonActionDeletePerson,
  IconPersonActionDetails,
  IconPersonActionEditAccount,
  IconPersonActionEditPerson,
  IconPersonActionPermissions,
  IconPersonAdministrator,
  IconPersonOther,
  IconPersonParent,
  IconPersonStudent,
  IconPersonTeacher,
} from '#/ui/Icon';
import { TextInput, ToggleButton } from '#/ui/Input';
import {
  FullWidthListCell,
  List,
  ListCell,
  ListHeader,
  ListRow,
} from '#/ui/List';
import { Note } from '#/ui/Note';
import { Table, TableCell, TableHeader, TableRow } from '#/ui/Table';
import { Variant } from '#/ui/variants';
import {
  Suspense,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';
import { Person, loadPersons } from './action';
import { useToggle } from '#/utils/client';
import { Alert } from '#/ui/Alert';
import { Modal } from '#/ui/Modal';
import { FormOfAddress } from '#/backend/repositories/content/account';
import { formatName } from '#/utils';

export const PersonsTable = ({
  formOfAddress,
}: {
  formOfAddress: FormOfAddress;
}) => {
  const [lastname, setLastname] = useState('');
  const [firstname, setFirstname] = useState('');
  const [clazz, setClass] = useState('');
  const [typeStudent, setTypeStudent] = useState(false);
  const [typeTeacher, setTypeTeacher] = useState(false);
  const [typeParent, setTypeParent] = useState(false);
  const [typeAdmin, setTypeAdmin] = useState(false);
  const [typeOther, setTypeOther] = useState(false);

  const lastnameId = useId();
  const firstnameId = useId();
  const classId = useId();

  const filterPart = useMemo(
    () => (
      <Table columns={'1fr 1fr 1fr auto'} rows={2}>
        <TableRow>
          <TableHeader>
            <Label
              htmlFor={lastnameId}
              t='schulhof.administration.sections.persons.page.filter.lastname'
            />
          </TableHeader>
          <TableHeader>
            <Label
              htmlFor={firstnameId}
              t='schulhof.administration.sections.persons.page.filter.firstname'
            />
          </TableHeader>
          <TableHeader>
            <Label
              htmlFor={classId}
              t='schulhof.administration.sections.persons.page.filter.class'
            />
          </TableHeader>
          <TableHeader>
            <Label t='schulhof.administration.sections.persons.page.filter.type' />
          </TableHeader>
        </TableRow>
        <TableRow>
          <TableCell>
            <TextInput id={lastnameId} onInput={setLastname} />
          </TableCell>
          <TableCell>
            <TextInput id={firstnameId} onInput={setFirstname} />
          </TableCell>
          <TableCell>
            <TextInput id={classId} onInput={setClass} />
          </TableCell>
          <TableCell>
            <ButtonGroup>
              <ToggleButton
                t={'generic.person-types.student.plural'}
                onChange={setTypeStudent}
              />
              <ToggleButton
                t={'generic.person-types.teacher.plural'}
                onChange={setTypeTeacher}
              />
              <ToggleButton
                t={'generic.person-types.parent.plural'}
                onChange={setTypeParent}
              />
              <ToggleButton
                t={'generic.person-types.admin.plural'}
                onChange={setTypeAdmin}
              />
              <ToggleButton
                t={'generic.person-types.other.plural'}
                onChange={setTypeOther}
              />
            </ButtonGroup>
          </TableCell>
        </TableRow>
      </Table>
    ),
    [
      lastnameId,
      firstnameId,
      classId,
      setLastname,
      setFirstname,
      setClass,
      setTypeStudent,
      setTypeTeacher,
      setTypeParent,
      setTypeAdmin,
      setTypeOther,
    ]
  );

  return (
    <>
      {filterPart}
      <Suspense fallback='LÄDT'>
        <ContentTable
          formOfAddress={formOfAddress}
          lastname={lastname}
          firstname={firstname}
          clazz={clazz}
          typeStudent={typeStudent}
          typeTeacher={typeTeacher}
          typeParent={typeParent}
          typeAdmin={typeAdmin}
          typeOther={typeOther}
        />
      </Suspense>
    </>
  );
};

const ContentTable = ({
  formOfAddress,
  lastname,
  firstname,
  clazz,
  typeStudent,
  typeTeacher,
  typeParent,
  typeAdmin,
  typeOther,
}: {
  formOfAddress: FormOfAddress;
  lastname: string;
  firstname: string;
  clazz: string;
  typeStudent: boolean;
  typeTeacher: boolean;
  typeParent: boolean;
  typeAdmin: boolean;
  typeOther: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [persons, setPersons] = useState<Person[] | null>(null);

  useEffect(() => {
    let unmounted = false as boolean;

    void (async () => {
      setIsLoading(true);
      const newPersons = await loadPersons({
        lastname,
        firstname,
        class: clazz,
        typeStudent,
        typeTeacher,
        typeParent,
        typeAdmin,
        typeOther,
      });

      if (unmounted) return;
      setPersons(newPersons);
      setIsLoading(false);
    })();

    return () => {
      unmounted = true;
    };
  }, [
    lastname,
    firstname,
    clazz,
    typeStudent,
    typeTeacher,
    typeParent,
    typeAdmin,
    typeOther,
  ]);

  return (
    <>
      <Heading
        size='2'
        t='schulhof.administration.sections.persons.page.table.title'
      />
      <List columns={`auto 1fr 1fr auto`} isLoading={isLoading}>
        <ListRow>
          <ListHeader />
          <ListHeader t='schulhof.administration.sections.persons.page.table.columns.firstname' />
          <ListHeader t='schulhof.administration.sections.persons.page.table.columns.lastname' />
          <ListHeader />
        </ListRow>
        {isLoading && persons === null ? (
          <ListRow>
            <FullWidthListCell>
              <Note>
                <T t='schulhof.administration.sections.persons.page.table.loading' />
              </Note>
            </FullWidthListCell>
          </ListRow>
        ) : null}
        {persons?.map((person) => (
          <PersonListRow
            key={person.id}
            person={person}
            formOfAddress={formOfAddress}
          />
        ))}
      </List>
    </>
  );
};

const PersonListRow = ({
  person,
  formOfAddress,
}: {
  person: Person;
  formOfAddress: FormOfAddress;
}) => {
  return (
    <ListRow key={person.id}>
      <ListCell>
        <PersonTypeIcon type={person.type} />
      </ListCell>
      <ListCell>{person.firstname}</ListCell>
      <ListCell>{person.lastname}</ListCell>
      <ListCell>
        <PersonActionIcons person={person} formOfAddress={formOfAddress} />
      </ListCell>
    </ListRow>
  );
};

const PersonTypeIcon = ({ type }: { type: Person['type'] }) => {
  switch (type) {
    case 'student':
      return <IconPersonStudent alt='generic.person-types.student.singular' />;
    case 'teacher':
      return <IconPersonTeacher alt='generic.person-types.teacher.singular' />;
    case 'parent':
      return <IconPersonParent alt='generic.person-types.parent.singular' />;
    case 'admin':
      return (
        <IconPersonAdministrator alt='generic.person-types.admin.singular' />
      );
    case 'other':
      return <IconPersonOther alt='generic.person-types.other.singular' />;
  }
};

const PersonActionIcons = ({
  person,
  formOfAddress,
}: {
  person: Person;
  formOfAddress: FormOfAddress;
}) => {
  const icons = [];

  const personName = formatName(person);

  // icons.push(
  //   <IconButton
  //     key='mail'
  //     icon={
  //       <IconPersonActionMail alt='schulhof.administration.sections.persons.page.table.actions.mail' />
  //     }
  //     href={`/${[
  //       t('paths.schulhof'),
  //       t('paths.schulhof.account'),
  //       t('paths.schulhof.account.mailbox'),
  //       t('paths.schulhof.account.mailbox.compose'),
  //     ].join('/')}?${t('paths.schulhof.account.mailbox.compose.query.to')}=${
  //       person.id
  //     }`}
  //   />
  // );

  icons.push(
    <IconButton
      key='details'
      title='schulhof.administration.sections.persons.page.table.actions.details'
      icon={
        <IconPersonActionDetails alt='schulhof.administration.sections.persons.page.table.actions.details' />
      }
      href={[
        'paths.schulhof',
        'paths.schulhof.administration',
        'paths.schulhof.administration.persons',
        `{${person.id}}`,
      ]}
    />
  );

  icons.push(
    <IconButton
      key='permissions'
      title='schulhof.administration.sections.persons.page.table.actions.permissions'
      icon={
        <IconPersonActionPermissions alt='schulhof.administration.sections.persons.page.table.actions.permissions' />
      }
      href={[
        'paths.schulhof',
        'paths.schulhof.administration',
        'paths.schulhof.administration.persons',
        `{${person.id}}`,
        'paths.schulhof.administration.persons.permissions',
      ]}
    />
  );

  icons.push(
    <IconButton
      key='edit-person'
      title='schulhof.administration.sections.persons.page.table.actions.edit.person'
      icon={
        <IconPersonActionEditPerson alt='schulhof.administration.sections.persons.page.table.actions.edit.person' />
      }
      href={[
        'paths.schulhof',
        'paths.schulhof.administration',
        'paths.schulhof.administration.persons',
        `{${person.id}}`,
        'paths.schulhof.administration.persons.edit-person',
      ]}
    />
  );

  icons.push(
    <IconButton
      key='edit-account'
      title='schulhof.administration.sections.persons.page.table.actions.edit.account'
      icon={
        <IconPersonActionEditAccount alt='schulhof.administration.sections.persons.page.table.actions.edit.account' />
      }
      href={[
        'paths.schulhof',
        'paths.schulhof.administration',
        'paths.schulhof.administration.persons',
        `{${person.id}}`,
        'paths.schulhof.administration.persons.edit-account',
      ]}
    />
  );

  icons.push(
    <DeleteAccountButton
      key='delete-account'
      personId={person.id}
      formOfAddress={formOfAddress}
      personName={personName}
    />
  );

  icons.push(
    <IconButton
      key='create-account'
      title='schulhof.administration.sections.persons.page.table.actions.create-account'
      variant={Variant.Success}
      icon={
        <IconPersonActionCreateAccount alt='schulhof.administration.sections.persons.page.table.actions.create-account' />
      }
    />
  );

  icons.push(
    <IconButton
      key='delete-person'
      title='schulhof.administration.sections.persons.page.table.actions.delete.person.with.action'
      variant={Variant.Error}
      icon={
        <IconPersonActionDeletePerson alt='schulhof.administration.sections.persons.page.table.actions.delete.person.with.action' />
      }
    />
  );

  return <ButtonGroup>{icons}</ButtonGroup>;
};

const DeleteAccountButton = ({
  personId,
  formOfAddress,
  personName,
}: {
  personId: string;
  formOfAddress: FormOfAddress;
  personName: string;
}) => {
  const [isOpen, setIsOpenTrue, setIsOpenFalse] = useToggle();
  const { t } = useT();
  const sendDelete = useSendDeleteAccount(personId);

  return (
    <>
      <IconButton
        title='schulhof.administration.sections.persons.page.table.actions.delete.account.other.action'
        variant={Variant.Error}
        icon={
          <IconPersonActionDeleteAccount alt='schulhof.administration.sections.persons.page.table.actions.delete.account.other.action' />
        }
        onClick={setIsOpenTrue}
      />
      {isOpen ? (
        <Modal onClose={setIsOpenFalse}>
          <Alert variant={Variant.Warning}>
            <Heading
              size='4'
              t={`schulhof.administration.sections.persons.page.table.actions.delete.account.other.title`}
            />
            {t(
              `schulhof.administration.sections.persons.page.table.actions.delete.account.other.description`,
              {
                form_of_address: formOfAddress,
                person_name: personName,
              }
            ).map((s, i) => (
              <p key={i}>{s}</p>
            ))}
          </Alert>
          <ButtonGroup>
            <Button onClick={setIsOpenFalse} t='generic.back' />
            <Button
              onClick={sendDelete}
              variant={Variant.Error}
              t={`schulhof.administration.sections.persons.page.table.actions.delete.account.other.action`}
            />
          </ButtonGroup>
        </Modal>
      ) : null}
    </>
  );
};

function useSendDeleteAccount(personId: string) {
  return useCallback(
    async function sendDelete() {
      alert(personId);
    },
    [personId]
  );
}
