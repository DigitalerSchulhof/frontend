import { DetailsButton } from '#/administration/sections/persons/page/table/content/buttons/details';
import { FormOfAddress } from '#/backend/repositories/content/account';
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
  List,
  ListCell,
  ListHeader,
  ListRow,
} from '#/ui/List';
import { Note } from '#/ui/Note';
import { formatName } from '#/utils';
import { useEffect, useState } from 'react';
import { LoadPersonsFilter, LoadedPerson, loadPersons } from '../../action';
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
  const [isLoading, setIsLoading] = useState(true);
  const [persons, setPersons] = useState<LoadedPerson[] | null>(null);

  useEffect(() => {
    let unmounted = false as boolean;

    void (async () => {
      setIsLoading(true);
      const newPersons = await loadPersons(filter);

      if (unmounted) return;
      setPersons(newPersons);
      setIsLoading(false);
    })();

    return () => {
      unmounted = true;
    };
  }, [filter]);

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
  person: LoadedPerson;
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

const PersonTypeIcon = ({ type }: { type: LoadedPerson['type'] }) => {
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
  person: LoadedPerson;
  formOfAddress: FormOfAddress;
}) => {
  const icons = [];

  const hasAccount = Math.random() > 0.5;

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
