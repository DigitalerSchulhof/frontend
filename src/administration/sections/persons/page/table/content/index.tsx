import { DetailsButton } from '#/administration/sections/persons/page/table/content/buttons/details';
import { DataList } from '#/components/data-list';
import { T } from '#/i18n';
import { createButtonGroup } from '#/ui/Button';
import { Heading } from '#/ui/Heading';
import {
  IconPersonAdministrator,
  IconPersonOther,
  IconPersonParent,
  IconPersonStudent,
  IconPersonTeacher,
} from '#/ui/Icon';
import {
  FullWidthListCell,
  ListCell,
  ListHeader,
  ListRow,
  calculateIconButtonGroupWidth,
} from '#/ui/List';
import { Note } from '#/ui/Note';
import { formatName } from '#/utils';
import type { ClientFormOfAddress } from '#/utils/client';
import { useCallback } from 'react';
import type { LoadPersonsFilter, LoadPersonsPerson } from '../action';
import action from '../action';
import {
  CreateAccountButton,
  DeleteAccountButton,
  DeletePersonButton,
  EditAccountButton,
  EditPersonButton,
  PermissionsButton,
} from './buttons';

export const PersonsTableContent = ({
  formOfAddress,
  filter,
}: {
  formOfAddress: ClientFormOfAddress;
  filter: LoadPersonsFilter;
}) => {
  const maxActionIcons = 6;

  return (
    <>
      <Heading
        size='2'
        t='schulhof.administration.sections.persons.page.table.title'
      />
      <DataList
        columns={`30px 1fr 1fr ${calculateIconButtonGroupWidth(
          maxActionIcons
        )}`}
        fetch={useCallback(
          (offset, limit) => action(filter, offset, limit),
          [filter]
        )}
        headerRow={
          <ListRow>
            <ListHeader />
            <ListHeader t='schulhof.administration.sections.persons.page.table.columns.firstname' />
            <ListHeader t='schulhof.administration.sections.persons.page.table.columns.lastname' />
            <ListHeader />
          </ListRow>
        }
        loadingRow={
          <ListRow>
            <FullWidthListCell>
              <Note>
                <T t='schulhof.administration.sections.persons.page.table.loading' />
              </Note>
            </FullWidthListCell>
          </ListRow>
        }
        errorRow={
          <ListRow>
            <FullWidthListCell>
              <Note>
                <T t='schulhof.administration.sections.persons.page.table.error' />
              </Note>
            </FullWidthListCell>
          </ListRow>
        }
        emptyRow={
          <ListRow>
            <FullWidthListCell>
              <Note>
                <T t='schulhof.administration.sections.persons.page.table.empty' />
              </Note>
            </FullWidthListCell>
          </ListRow>
        }
        dataRow={useCallback(
          (person: LoadPersonsPerson) => (
            <>
              <ListRow key={person.id}>
                <ListCell>
                  <PersonTypeIcon type={person.type} />
                </ListCell>
                <ListCell>{person.firstname}</ListCell>
                <ListCell>{person.lastname}</ListCell>
                <ListCell>
                  <PersonActionIcons
                    person={person}
                    formOfAddress={formOfAddress}
                  />
                </ListCell>
              </ListRow>
            </>
          ),
          [formOfAddress]
        )}
      />
    </>
  );
};

const PersonTypeIcon = ({ type }: { type: LoadPersonsPerson['type'] }) => {
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
  person: LoadPersonsPerson;
  formOfAddress: ClientFormOfAddress;
}) => {
  const personName = formatName(person);

  return createButtonGroup(
    person.permissions.mayDetails ? (
      <DetailsButton key='details' personId={person.id} />
    ) : null,
    person.permissions.mayPermissions ? (
      <PermissionsButton key='permissions' personId={person.id} />
    ) : null,
    person.permissions.mayEditPerson ? (
      <EditPersonButton key='edit-person' personId={person.id} />
    ) : null,
    person.permissions.mayCreateAccount ? (
      <CreateAccountButton key='create-account' personId={person.id} />
    ) : null,
    person.permissions.mayEditAccount ? (
      <EditAccountButton key='edit-account' personId={person.id} />
    ) : null,
    person.permissions.mayDeleteAccount ? (
      <DeleteAccountButton
        key='delete-account'
        personId={person.id}
        personRev={person.rev}
        formOfAddress={formOfAddress}
        personName={personName}
      />
    ) : null,
    person.permissions.mayDeletePerson ? (
      <DeletePersonButton
        key='delete-person'
        personId={person.id}
        personRev={person.rev}
        formOfAddress={formOfAddress}
        personName={personName}
        hasAccount={person.hasAccount}
      />
    ) : null
  );
};
