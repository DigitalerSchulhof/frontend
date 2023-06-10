'use client';

import {
  AccountSettings,
  FormOfAddress,
} from '#/backend/repositories/content/account';
import { T, useT } from '#/i18n';
import { Alert } from '#/ui/Alert';
import { Button, ButtonGroup } from '#/ui/Button';
import { Col } from '#/ui/Col';
import {
  DisplayContentsForm,
  NumberFormRow,
  NumberOrNullFormRow,
  SelectFormRow,
  ToggleFormRow,
} from '#/ui/Form';
import { Heading } from '#/ui/Heading';
import { Modal } from '#/ui/Modal';
import { ErrorModal, LoadingModal } from '#/ui/Modal/client';
import { Table } from '#/ui/Table';
import { unwrapAction } from '#/utils/client';
import { useSend } from '#/utils/form';
import { useCallback, useMemo, useRef } from 'react';
import { editSettings } from './action';

export const EditAccountSettingsForm = ({
  isOwnProfile,
  personId,
  settings,
  maxSessionTimeout,
}: {
  isOwnProfile: boolean;
  personId: string;
  settings: AccountSettings;
  maxSessionTimeout: number;
}) => {
  const own = isOwnProfile ? 'own' : 'other';

  const refs = useRefs();

  const [sendSettings, modal] = useSubmit(
    isOwnProfile,
    personId,
    maxSessionTimeout,
    refs
  );

  return (
    <DisplayContentsForm onSubmit={sendSettings}>
      {modal}
      <Col w='6'>
        <Heading
          size='2'
          t='schulhof.administration.sections.persons.settings.form.emailOn.title'
        />
        <Table columns='1fr auto'>
          <ToggleFormRow
            label='schulhof.administration.sections.persons.settings.form.emailOn.title'
            defaultValue={settings.emailOn.newMessage}
            ref={refs.emailOnNewMessage}
          />
          <ToggleFormRow
            label='schulhof.administration.sections.persons.settings.form.emailOn.newSubstitution'
            defaultValue={settings.emailOn.newSubstitution}
            ref={refs.emailOnNewSubstitution}
          />
          <ToggleFormRow
            label='schulhof.administration.sections.persons.settings.form.emailOn.newNews'
            defaultValue={settings.emailOn.newNews}
            ref={refs.emailOnNewNews}
          />
        </Table>
        <Heading
          size='2'
          t='schulhof.administration.sections.persons.settings.form.pushOn.title'
        />
        <Table columns='1fr auto'>
          <ToggleFormRow
            label='schulhof.administration.sections.persons.settings.form.pushOn.newMessage'
            defaultValue={settings.pushOn.newMessage}
            ref={refs.pushOnNewMessage}
          />
          <ToggleFormRow
            label='schulhof.administration.sections.persons.settings.form.pushOn.newSubstitution'
            defaultValue={settings.pushOn.newSubstitution}
            ref={refs.pushOnNewSubstitution}
          />
          <ToggleFormRow
            label='schulhof.administration.sections.persons.settings.form.pushOn.newNews'
            defaultValue={settings.pushOn.newNews}
            ref={refs.pushOnNewNews}
          />
        </Table>
        <Heading
          size='2'
          t='schulhof.administration.sections.persons.settings.form.considerNews.title'
        />
        <Table columns='1fr auto'>
          <ToggleFormRow
            label='schulhof.administration.sections.persons.settings.form.considerNews.newEvent'
            defaultValue={settings.considerNews.newEvent}
            ref={refs.considerNewsNewEvent}
          />
          <ToggleFormRow
            label='schulhof.administration.sections.persons.settings.form.considerNews.newBlog'
            defaultValue={settings.considerNews.newBlog}
            ref={refs.considerNewsNewBlog}
          />
          <ToggleFormRow
            label='schulhof.administration.sections.persons.settings.form.considerNews.newGallery'
            defaultValue={settings.considerNews.newGallery}
            ref={refs.considerNewsNewGallery}
          />
          <ToggleFormRow
            label='schulhof.administration.sections.persons.settings.form.considerNews.fileChanged'
            defaultValue={settings.considerNews.fileChanged}
            ref={refs.considerNewsFileChanged}
          />
        </Table>
      </Col>
      <Col w='6'>
        <Heading
          size='2'
          t='schulhof.administration.sections.persons.settings.form.mailbox.title'
        />
        <Table columns='1fr 150px'>
          <NumberOrNullFormRow
            whetherLabel='schulhof.administration.sections.persons.settings.form.mailbox.deleteAfter.title.whether'
            numberLabel='schulhof.administration.sections.persons.settings.form.mailbox.deleteAfter.title.number'
            unit='schulhof.administration.sections.persons.settings.form.mailbox.deleteAfterInBin.unit'
            defaultValue={settings.mailbox.deleteAfter}
            numberDefaultValue={100}
            ref={refs.mailboxDeleteAfter}
          />
          <NumberOrNullFormRow
            whetherLabel='schulhof.administration.sections.persons.settings.form.mailbox.deleteAfterInBin.title.whether'
            numberLabel='schulhof.administration.sections.persons.settings.form.mailbox.deleteAfterInBin.title.number'
            unit='schulhof.administration.sections.persons.settings.form.mailbox.deleteAfterInBin.unit'
            defaultValue={settings.mailbox.deleteAfterInBin}
            numberDefaultValue={100}
            ref={refs.mailboxDeleteAfterInBin}
          />
        </Table>
        <Heading
          size='2'
          t='schulhof.administration.sections.persons.settings.form.profile.title'
        />
        <Table columns='1fr 150px'>
          <NumberFormRow
            label='schulhof.administration.sections.persons.settings.form.profile.sessionTimeout.title'
            unit='schulhof.administration.sections.persons.settings.form.profile.sessionTimeout.unit'
            defaultValue={settings.profile.sessionTimeout}
            ref={refs.profileSessionTimeout}
          />
          <SelectFormRow
            label='schulhof.administration.sections.persons.settings.form.profile.formOfAddress.title'
            defaultValue={settings.profile.formOfAddress}
            ref={refs.profileFormOfAddress}
            values={{
              informal:
                'schulhof.administration.sections.persons.settings.form.profile.formOfAddress.values.informal',
              formal:
                'schulhof.administration.sections.persons.settings.form.profile.formOfAddress.values.formal',
            }}
          />
        </Table>
      </Col>
      <Col w='12'>
        <Alert
          variant='information'
          title='schulhof.administration.sections.persons.settings.disclaimer.title'
        >
          <p>
            <T t='schulhof.administration.sections.persons.settings.disclaimer.description' />
          </p>
        </Alert>
        <ButtonGroup>
          <Button
            type='submit'
            variant='success'
            t='schulhof.administration.sections.persons.settings.form.buttons.save'
          />
          <Button
            href={
              isOwnProfile
                ? [
                    'paths.schulhof',
                    'paths.schulhof.account',
                    'paths.schulhof.account.profile',
                  ]
                : [
                    'paths.schulhof',
                    'paths.schulhof.administration',
                    'paths.schulhof.administration.persons',
                    `{${personId}}`,
                  ]
            }
            t={`schulhof.administration.sections.persons.settings.form.buttons.back.${own}`}
          />
        </ButtonGroup>
      </Col>
    </DisplayContentsForm>
  );
};

function useRefs() {
  const emailOnNewMessage = useRef<{ value: boolean }>(null);
  const emailOnNewSubstitution = useRef<{ value: boolean }>(null);
  const emailOnNewNews = useRef<{ value: boolean }>(null);
  const pushOnNewMessage = useRef<{ value: boolean }>(null);
  const pushOnNewSubstitution = useRef<{ value: boolean }>(null);
  const pushOnNewNews = useRef<{ value: boolean }>(null);
  const considerNewsNewEvent = useRef<{ value: boolean }>(null);
  const considerNewsNewBlog = useRef<{ value: boolean }>(null);
  const considerNewsNewGallery = useRef<{ value: boolean }>(null);
  const considerNewsFileChanged = useRef<{ value: boolean }>(null);
  const mailboxDeleteAfter = useRef<{ value: number | null }>(null);
  const mailboxDeleteAfterInBin = useRef<{ value: number | null }>(null);
  const profileSessionTimeout = useRef<{ value: number }>(null);
  const profileFormOfAddress = useRef<{ value: FormOfAddress }>(null);

  return useMemo(
    () => ({
      emailOnNewMessage,
      emailOnNewSubstitution,
      emailOnNewNews,
      pushOnNewMessage,
      pushOnNewSubstitution,
      pushOnNewNews,
      considerNewsNewEvent,
      considerNewsNewBlog,
      considerNewsNewGallery,
      considerNewsFileChanged,
      mailboxDeleteAfter,
      mailboxDeleteAfterInBin,
      profileSessionTimeout,
      profileFormOfAddress,
    }),
    [
      emailOnNewMessage,
      emailOnNewSubstitution,
      emailOnNewNews,
      pushOnNewMessage,
      pushOnNewSubstitution,
      pushOnNewNews,
      considerNewsNewEvent,
      considerNewsNewBlog,
      considerNewsNewGallery,
      considerNewsFileChanged,
      mailboxDeleteAfter,
      mailboxDeleteAfterInBin,
      profileSessionTimeout,
      profileFormOfAddress,
    ]
  );
}

function mapError(err: string) {
  switch (err) {
    case 'ACCOUNT_SETTINGS_MAILBOX_DELETE_AFTER_IN_BIN_INVALID':
      return 'invalid-mailbox-delete-after-in-bin';
    case 'ACCOUNT_SETTINGS_MAILBOX_DELETE_AFTER_INVALID':
      return 'invalid-mailbox-delete-after';
    case 'ACCOUNT_SETTINGS_PROFILE_SESSION_TIMEOUT_INVALID':
      return 'invalid-session-timeout';
    default:
      return 'internal-error';
  }
}
