import { FormOfAddress } from '#/backend/repositories/content/account';
import { PersonType } from '#/backend/repositories/content/person';
import { LoggedInBackendContext } from '#/context';
import { Button, ButtonGroup } from '#/ui/Button';
import { Heading } from '#/ui/Heading';
import { Note } from '#/ui/Note';
import { Variant } from '#/ui/variants';
import { formatName } from '#/utils';
import { PersonDetailsProps } from '..';
import { DeleteAccountButton } from '../buttons/delete-account';
import { DeletePersonButton } from '../buttons/delete-person';

export type PersonDetailsChangePersonalDataSectionProps = Pick<
  PersonDetailsProps,
  'person' | 'account'
> & {
  context: LoggedInBackendContext;
  isOwnProfile: boolean;
};

export const PersonDetailsChangePersonalDataSection = ({
  context,
  isOwnProfile,
  person,
  account,
}: PersonDetailsChangePersonalDataSectionProps) => {
  return (
    <>
      <Heading
        size='2'
        t='schulhof.administration.sections.persons.details.change-personal-data.title'
      />
      <ButtonGroup>
        <UserButtons
          formOfAddress={context.account.formOfAddress}
          isOwnProfile={isOwnProfile}
          person={person}
          account={account}
        />
      </ButtonGroup>
      <ButtonGroup>
        <AdminButtons
          formOfAddress={context.account.formOfAddress}
          person={person}
          account={account}
        />
      </ButtonGroup>
      {!isOwnProfile ? (
        <Note t='schulhof.administration.sections.persons.details.change-personal-data.actions.change-password.note' />
      ) : null}
    </>
  );
};

type AccountButtonsProps = Pick<PersonDetailsProps, 'person' | 'account'> & {
  formOfAddress: FormOfAddress;
  isOwnProfile: boolean;
};

const UserButtons = ({
  formOfAddress,
  isOwnProfile,
  person,
  account,
}: AccountButtonsProps) => {
  return (
    <>
      {[
        account && (
          <Button
            key='edit-account'
            t='schulhof.administration.sections.persons.details.change-personal-data.actions.edit-account'
            href={
              isOwnProfile
                ? [
                    'paths.schulhof',
                    'paths.schulhof.account',
                    'paths.schulhof.account.profile',
                    'paths.schulhof.account.profile.edit-account',
                  ]
                : [
                    'paths.schulhof',
                    'paths.schulhof.administration',
                    'paths.schulhof.administration.persons',
                    `{${person.id}}`,
                    'paths.schulhof.administration.persons.edit-account',
                  ]
            }
          />
        ),
        isOwnProfile && (
          <Button
            key='change-password'
            t='schulhof.administration.sections.persons.details.change-personal-data.actions.change-password.button'
            href={[
              'paths.schulhof',
              'paths.schulhof.account',
              'paths.schulhof.account.profile',
              'paths.schulhof.account.profile.change-password',
            ]}
          />
        ),
        <Button
          key='settings'
          t='schulhof.administration.sections.persons.details.change-personal-data.actions.settings'
          href={
            isOwnProfile
              ? [
                  'paths.schulhof',
                  'paths.schulhof.account',
                  'paths.schulhof.account.profile',
                  'paths.schulhof.account.profile.settings',
                ]
              : [
                  'paths.schulhof',
                  'paths.schulhof.administration',
                  'paths.schulhof.administration.persons',
                  `{${person.id}}`,
                  'paths.schulhof.administration.persons.settings',
                ]
          }
        />,
        isOwnProfile && (
          <Button
            key='identity-theft'
            t='schulhof.administration.sections.persons.details.change-personal-data.actions.identity-theft'
            variant={Variant.Warning}
            href={[
              'paths.schulhof',
              'paths.schulhof.account',
              'paths.schulhof.account.profile',
              'paths.schulhof.account.profile.identity-theft',
            ]}
          />
        ),
        account && (
          <DeleteAccountButton
            key='delete-account'
            formOfAddress={formOfAddress}
            isOwnProfile={isOwnProfile}
            personId={person.id}
            personName={formatName(person)}
          />
        ),
      ].filter(Boolean)}
    </>
  );
};

type PersonButtonsProps = Pick<PersonDetailsProps, 'person' | 'account'> & {
  formOfAddress: FormOfAddress;
};

const AdminButtons = ({
  formOfAddress,
  person,
  account,
}: PersonButtonsProps) => {
  return (
    <>
      {[
        <Button
          key='edit-person'
          t='schulhof.administration.sections.persons.details.change-personal-data.actions.edit-person'
          href={[
            'paths.schulhof',
            'paths.schulhof.administration',
            'paths.schulhof.administration.persons',
            `{${person.id}}`,
            'paths.schulhof.administration.persons.edit-person',
          ]}
        />,
        person.type === PersonType.Teacher && (
          <Button
            key='change-teacher-code'
            t='schulhof.administration.sections.persons.details.change-personal-data.actions.change-teacher-code'
            href={[
              'paths.schulhof',
              'paths.schulhof.administration',
              'paths.schulhof.administration.persons',
              `{${person.id}}`,
              'paths.schulhof.administration.persons.change-teacher-code',
            ]}
          />
        ),
        <Button
          key='permissions-and-roles'
          t='schulhof.administration.sections.persons.details.change-personal-data.actions.permissions-and-roles'
          href={[
            'paths.schulhof',
            'paths.schulhof.administration',
            'paths.schulhof.administration.persons',
            `{${person.id}}`,
            'paths.schulhof.administration.persons.permissions-and-roles',
          ]}
        />,
        !account && (
          <Button
            key='create-account'
            variant={Variant.Success}
            t='schulhof.administration.sections.persons.details.change-personal-data.actions.create-account'
            href={[
              'paths.schulhof',
              'paths.schulhof.administration',
              'paths.schulhof.administration.persons',
              `{${person.id}}`,
              'paths.schulhof.administration.persons.create-account',
            ]}
          />
        ),
        <DeletePersonButton
          key='delete-person'
          formOfAddress={formOfAddress}
          personId={person.id}
          personName={formatName(person)}
          hasAccount={!!account}
        />,
      ].filter(Boolean)}
    </>
  );
};
