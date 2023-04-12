import { FormOfAddress } from '#/backend/repositories/content/person';
import { Button, ButtonGroup } from '#/ui/Button';
import { Heading } from '#/ui/Heading';
import { Variant } from '#/ui/variants';
import { formatName } from '#/utils';
import { PersonDetailsProps } from '..';
import { DeleteAccountButton } from '../buttons/delete-account';
import { DeletePersonButton } from '../buttons/delete-person';

export type PersonDetailsChangePersonalDataSectionProps = Pick<
  PersonDetailsProps,
  'context' | 'person' | 'account'
>;

export const PersonDetailsChangePersonalDataSection = ({
  context,
  person,
  account,
}: PersonDetailsChangePersonalDataSectionProps) => {
  return (
    <>
      <Heading
        size='2'
        t='schulhof.administration.sections.persons.slices.persons.details.change-personal-data.title'
      />
      <ButtonGroup>
        <AccountButtons
          formOfAddress={context.person.formOfAddress}
          person={person}
          account={account}
          isOwnAccount={context.person.id === person.id}
        />
      </ButtonGroup>
      <ButtonGroup>
        <PersonButtons
          formOfAddress={context.person.formOfAddress}
          person={person}
          account={account}
        />
      </ButtonGroup>
    </>
  );
};

type AccountButtonsProps = Pick<PersonDetailsProps, 'person' | 'account'> & {
  formOfAddress: FormOfAddress;
  isOwnAccount: boolean;
};

const AccountButtons = ({
  formOfAddress,
  person,
  account,
  isOwnAccount,
}: AccountButtonsProps) => {
  return !account ? (
    <Button
      variant={Variant.Success}
      t='schulhof.administration.sections.persons.slices.persons.details.change-personal-data.actions.create-account'
      href={[
        'paths.schulhof',
        'paths.schulhof.administration',
        'paths.schulhof.administration.persons',
        'paths.schulhof.administration.persons.persons',
        'paths.schulhof.administration.persons.persons.create-account',
        `{${person.id}}`,
      ]}
    />
  ) : (
    <>
      <Button
        t='schulhof.administration.sections.persons.slices.persons.details.change-personal-data.actions.edit-account'
        href={[
          'paths.schulhof',
          'paths.schulhof.administration',
          'paths.schulhof.administration.persons',
          'paths.schulhof.administration.persons.persons',
          'paths.schulhof.administration.persons.persons.edit-account',
          `{${person.id}}`,
        ]}
      />
      <DeleteAccountButton
        formOfAddress={formOfAddress}
        personId={person.id}
        personName={formatName(person)}
        isOwnAccount={isOwnAccount}
      />
    </>
  );
};

type PersonButtonsProps = Pick<PersonDetailsProps, 'person' | 'account'> & {
  formOfAddress: FormOfAddress;
};

const PersonButtons = ({
  formOfAddress,
  person,
  account,
}: PersonButtonsProps) => {
  return (
    <>
      <Button
        t='schulhof.administration.sections.persons.slices.persons.details.change-personal-data.actions.settings'
        href={[
          'paths.schulhof',
          'paths.schulhof.administration',
          'paths.schulhof.administration.persons',
          'paths.schulhof.administration.persons.persons',
          'paths.schulhof.administration.persons.persons.settings',
          `{${person.id}}`,
        ]}
      />
      <Button
        t='schulhof.administration.sections.persons.slices.persons.details.change-personal-data.actions.permissions-and-roles'
        href={[
          'paths.schulhof',
          'paths.schulhof.administration',
          'paths.schulhof.administration.persons',
          'paths.schulhof.administration.persons.persons',
          'paths.schulhof.administration.persons.persons.permissions-and-roles',
          `{${person.id}}`,
        ]}
      />
      <Button
        t='schulhof.administration.sections.persons.slices.persons.details.change-personal-data.actions.edit-person'
        href={[
          'paths.schulhof',
          'paths.schulhof.administration',
          'paths.schulhof.administration.persons',
          'paths.schulhof.administration.persons.persons',
          'paths.schulhof.administration.persons.persons.edit',
          `{${person.id}}`,
        ]}
      />
      <DeletePersonButton
        formOfAddress={formOfAddress}
        personId={person.id}
        personName={formatName(person)}
        hasAccount={!!account}
      />
    </>
  );
};
