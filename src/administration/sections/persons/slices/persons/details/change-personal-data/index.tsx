import { LoggedInBackendContext } from '#/backend/context';
import {
  FormOfAddress,
  PersonType,
} from '#/backend/repositories/content/person';
import { Button, ButtonGroup } from '#/ui/Button';
import { Heading } from '#/ui/Heading';
import { Note } from '#/ui/Note';
import { Variant } from '#/ui/variants';
import { formatName } from '#/utils';
import React from 'react';
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
  const isOwnAccount = context.person.id === person.id;

  return (
    <>
      <Heading
        size='2'
        t='schulhof.administration.sections.persons.slices.persons.details.change-personal-data.title'
      />
      <ButtonGroup>
        <AccountButtons
          formOfAddress={context.person.formOfAddress}
          isOwnProfile={isOwnProfile}
          isOwnAccount={isOwnAccount}
          person={person}
          account={account}
        />
      </ButtonGroup>
      {!isOwnAccount ? (
        <Note t='schulhof.administration.sections.persons.slices.persons.details.change-personal-data.actions.change-password.note' />
      ) : null}
      <ButtonGroup>
        <PersonButtons
          formOfAddress={context.person.formOfAddress}
          isOwnProfile={isOwnProfile}
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
  isOwnProfile: boolean;
};

const AccountButtons = ({
  formOfAddress,
  isOwnProfile,
  isOwnAccount,
  person,
  account,
}: AccountButtonsProps) => {
  return (
    <>
      {React.Children.toArray(
        [
          !account && (
            <Button
              variant={Variant.Success}
              t='schulhof.administration.sections.persons.slices.persons.details.change-personal-data.actions.create-account'
              href={[
                'paths.schulhof',
                'paths.schulhof.administration',
                'paths.schulhof.administration.persons',
                'paths.schulhof.administration.persons.persons',
                `{${person.id}}`,
                'paths.schulhof.administration.persons.persons.create-account',
              ]}
            />
          ),
          isOwnAccount && (
            <Button
              t='schulhof.administration.sections.persons.slices.persons.details.change-personal-data.actions.change-password.button'
              href={[
                'paths.schulhof',
                'paths.schulhof.account',
                'paths.schulhof.account.profile',
                'paths.schulhof.account.profile.change-password',
              ]}
            />
          ),
          account && (
            <Button
              t='schulhof.administration.sections.persons.slices.persons.details.change-personal-data.actions.edit-account'
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
                      'paths.schulhof.administration.persons.persons',
                      `{${person.id}}`,
                      'paths.schulhof.administration.persons.persons.edit-account',
                    ]
              }
            />
          ),
          isOwnProfile && (
            <Button
              t='schulhof.administration.sections.persons.slices.persons.details.change-personal-data.actions.identity-theft'
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
              formOfAddress={formOfAddress}
              isOwnProfile={isOwnProfile}
              personId={person.id}
              personName={formatName(person)}
            />
          ),
        ].filter(Boolean)
      )}
    </>
  );
};

type PersonButtonsProps = Pick<PersonDetailsProps, 'person' | 'account'> & {
  formOfAddress: FormOfAddress;
  isOwnProfile: boolean;
};

const PersonButtons = ({
  formOfAddress,
  isOwnProfile,
  person,
  account,
}: PersonButtonsProps) => {
  return (
    <>
      {React.Children.toArray(
        [
          <Button
            t='schulhof.administration.sections.persons.slices.persons.details.change-personal-data.actions.settings'
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
                    'paths.schulhof.administration.persons.persons',
                    `{${person.id}}`,
                    'paths.schulhof.administration.persons.persons.settings',
                  ]
            }
          />,
          person.type === PersonType.Teacher && (
            <Button
              t='schulhof.administration.sections.persons.slices.persons.details.change-personal-data.actions.change-teacher-code'
              href={[
                'paths.schulhof',
                'paths.schulhof.administration',
                'paths.schulhof.administration.persons',
                'paths.schulhof.administration.persons.persons',
                `{${person.id}}`,
                'paths.schulhof.administration.persons.persons.change-teacher-code',
              ]}
            />
          ),
          <Button
            t='schulhof.administration.sections.persons.slices.persons.details.change-personal-data.actions.permissions-and-roles'
            href={[
              'paths.schulhof',
              'paths.schulhof.administration',
              'paths.schulhof.administration.persons',
              'paths.schulhof.administration.persons.persons',
              `{${person.id}}`,
              'paths.schulhof.administration.persons.persons.permissions-and-roles',
            ]}
          />,
          <Button
            t='schulhof.administration.sections.persons.slices.persons.details.change-personal-data.actions.edit-person'
            href={
              isOwnProfile
                ? [
                    'paths.schulhof',
                    'paths.schulhof.account',
                    'paths.schulhof.account.profile',
                    'paths.schulhof.account.profile.edit',
                  ]
                : [
                    'paths.schulhof',
                    'paths.schulhof.administration',
                    'paths.schulhof.administration.persons',
                    'paths.schulhof.administration.persons.persons',
                    `{${person.id}}`,
                    'paths.schulhof.administration.persons.persons.edit',
                  ]
            }
          />,
          <DeletePersonButton
            formOfAddress={formOfAddress}
            personId={person.id}
            personName={formatName(person)}
            hasAccount={!!account}
          />,
        ].filter(Boolean)
      )}
    </>
  );
};
