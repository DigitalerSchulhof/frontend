import { DetailsButton } from '#/administration/sections/persons/page/table/content/buttons/details';
import { FormOfAddress } from '#/backend/repositories/content/account';
import { DataList } from '#/components/data-list';
import { T } from '#/i18n';
import { ButtonGroup } from '#/ui/Button';
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
import { useCallback } from 'react';
import action, { LoadPersonsFilter, LoadPersonsPerson } from '../../action';
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
  formOfAddress: FormOfAddress;
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
  formOfAddress: FormOfAddress;
}) => {
  const icons = [];

  const hasAccount = person.hasAccount;

  const personName = formatName(person);

  icons.push(<DetailsButton key='details' personId={person.id} />);

  icons.push(<PermissionsButton key='permissions' personId={person.id} />);

  icons.push(<EditPersonButton key='edit-person' personId={person.id} />);

  if (hasAccount) {
    icons.push(<EditAccountButton key='edit-account' personId={person.id} />);
  }

  if (!hasAccount) {
    icons.push(
      <CreateAccountButton key='create-account' personId={person.id} />
    );
  }

  if (hasAccount) {
    icons.push(
      <DeleteAccountButton
        key='delete-account'
        formOfAddress={formOfAddress}
        personId={person.id}
        personName={personName}
      />
    );
  }

  icons.push(
    <DeletePersonButton
      key='delete-person'
      formOfAddress={formOfAddress}
      personId={person.id}
      personName={personName}
      hasAccount={hasAccount}
    />
  );

  return <ButtonGroup>{icons}</ButtonGroup>;
};
