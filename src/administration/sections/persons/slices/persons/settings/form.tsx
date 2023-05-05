'use client';

import {
  SettingsInput,
  SettingsOutputNotOk,
  SettingsOutputOk,
} from '#/app/api/schulhof/administration/persons/persons/settings/route';
import { AccountSettings } from '#/backend/repositories/content/account';
import { T } from '#/i18n';
import { useT } from '#/i18n/client';
import { Alert } from '#/ui/Alert';
import { Button, ButtonGroup } from '#/ui/Button';
import { Col } from '#/ui/Col';
import {
  DisplayContentsForm,
  NumberFormRow,
  NumberOrNullFormRow,
  ToggleFormRow,
} from '#/ui/Form';
import { Heading } from '#/ui/Heading';
import { LoadingModal, Modal } from '#/ui/Modal';
import { Table } from '#/ui/Table';
import { Variant } from '#/ui/variants';
import { FormState, useSend } from '#/utils/form';
import { useCallback, useMemo, useRef } from 'react';

export const SettingsForm = ({
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

  const [sendSettings, modal] = useSubmit(isOwnProfile, personId, refs);

  return (
    <DisplayContentsForm onSubmit={sendSettings}>
      {modal}
      <Col w='6'>
        <Heading
          size='2'
          t='schulhof.administration.sections.persons.slices.persons.settings.form.emailOn.title'
        />
        <Table columns='1fr auto'>
          <ToggleFormRow
            label='schulhof.administration.sections.persons.slices.persons.settings.form.emailOn.title'
            defaultValue={settings.emailOn.newMessage}
            ref={refs.emailOnNewMessage}
          />
          <ToggleFormRow
            label='schulhof.administration.sections.persons.slices.persons.settings.form.emailOn.newSubstitution'
            defaultValue={settings.emailOn.newSubstitution}
            ref={refs.emailOnNewSubstitution}
          />
          <ToggleFormRow
            label='schulhof.administration.sections.persons.slices.persons.settings.form.emailOn.newNews'
            defaultValue={settings.emailOn.newNews}
            ref={refs.emailOnNewNews}
          />
        </Table>
        <Heading
          size='2'
          t='schulhof.administration.sections.persons.slices.persons.settings.form.pushOn.title'
        />
        <Table columns='1fr auto'>
          <ToggleFormRow
            label='schulhof.administration.sections.persons.slices.persons.settings.form.pushOn.newMessage'
            defaultValue={settings.pushOn.newMessage}
            ref={refs.pushOnNewMessage}
          />
          <ToggleFormRow
            label='schulhof.administration.sections.persons.slices.persons.settings.form.pushOn.newSubstitution'
            defaultValue={settings.pushOn.newSubstitution}
            ref={refs.pushOnNewSubstitution}
          />
          <ToggleFormRow
            label='schulhof.administration.sections.persons.slices.persons.settings.form.pushOn.newNews'
            defaultValue={settings.pushOn.newNews}
            ref={refs.pushOnNewNews}
          />
        </Table>
        <Heading
          size='2'
          t='schulhof.administration.sections.persons.slices.persons.settings.form.considerNews.title'
        />
        <Table columns='1fr auto'>
          <ToggleFormRow
            label='schulhof.administration.sections.persons.slices.persons.settings.form.considerNews.newEvent'
            defaultValue={settings.considerNews.newEvent}
            ref={refs.considerNewsNewEvent}
          />
          <ToggleFormRow
            label='schulhof.administration.sections.persons.slices.persons.settings.form.considerNews.newBlog'
            defaultValue={settings.considerNews.newBlog}
            ref={refs.considerNewsNewBlog}
          />
          <ToggleFormRow
            label='schulhof.administration.sections.persons.slices.persons.settings.form.considerNews.newGallery'
            defaultValue={settings.considerNews.newGallery}
            ref={refs.considerNewsNewGallery}
          />
          <ToggleFormRow
            label='schulhof.administration.sections.persons.slices.persons.settings.form.considerNews.fileChanged'
            defaultValue={settings.considerNews.fileChanged}
            ref={refs.considerNewsFileChanged}
          />
        </Table>
      </Col>
      <Col w='6'>
        <Heading
          size='2'
          t='schulhof.administration.sections.persons.slices.persons.settings.form.mailbox.title'
        />
        <Table columns='1fr 150px'>
          <NumberOrNullFormRow
            whetherLabel='schulhof.administration.sections.persons.slices.persons.settings.form.mailbox.deleteAfter.title.whether'
            numberLabel='schulhof.administration.sections.persons.slices.persons.settings.form.mailbox.deleteAfter.title.number'
            unit='schulhof.administration.sections.persons.slices.persons.settings.form.mailbox.deleteAfterInBin.unit'
            defaultValue={settings.mailbox.deleteAfter}
            ref={refs.mailboxDeleteAfter}
            min={0}
          />
          <NumberOrNullFormRow
            whetherLabel='schulhof.administration.sections.persons.slices.persons.settings.form.mailbox.deleteAfterInBin.title.whether'
            numberLabel='schulhof.administration.sections.persons.slices.persons.settings.form.mailbox.deleteAfterInBin.title.number'
            unit='schulhof.administration.sections.persons.slices.persons.settings.form.mailbox.deleteAfterInBin.unit'
            defaultValue={settings.mailbox.deleteAfterInBin}
            ref={refs.mailboxDeleteAfterInBin}
            min={0}
          />
        </Table>
        <Heading
          size='2'
          t='schulhof.administration.sections.persons.slices.persons.settings.form.profile.title'
        />
        <Table columns='1fr 150px'>
          <NumberFormRow
            label='schulhof.administration.sections.persons.slices.persons.settings.form.profile.sessionTimeout.title'
            unit='schulhof.administration.sections.persons.slices.persons.settings.form.profile.sessionTimeout.unit'
            defaultValue={settings.profile.sessionTimeout}
            ref={refs.profileSessionTimeout}
            min={0}
            max={maxSessionTimeout}
          />
        </Table>
      </Col>
      <Col w='12'>
        <Alert
          variant={Variant.Information}
          title='schulhof.administration.sections.persons.slices.persons.settings.disclaimer.title'
        >
          <p>
            <T t='schulhof.administration.sections.persons.slices.persons.settings.disclaimer.description' />
          </p>
        </Alert>
        <ButtonGroup>
          <Button
            type='submit'
            variant={Variant.Success}
            t='schulhof.administration.sections.persons.slices.persons.settings.form.buttons.save'
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
                    'paths.schulhof.administration.persons.persons',
                    `{${personId}}`,
                  ]
            }
            t={`schulhof.administration.sections.persons.slices.persons.settings.form.buttons.back.${own}`}
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
    ]
  );
}

type FormError =
  | 'internal-error'
  | 'invalid-mailbox-delete-after'
  | 'invalid-mailbox-delete-after-in-bin'
  | 'invalid-session-timeout';

function useSubmit(
  isOwnProfile: boolean,
  personId: string,
  refs: ReturnType<typeof useRefs>
) {
  const { t } = useT();

  return useSend<
    SettingsInput,
    SettingsOutputOk,
    SettingsOutputNotOk,
    FormError
  >(
    '/api/schulhof/administration/persons/persons/settings',
    useCallback(
      () => ({
        personId,
        settings: {
          emailOn: {
            newMessage: refs.emailOnNewMessage.current!.value,
            newSubstitution: refs.emailOnNewSubstitution.current!.value,
            newNews: refs.emailOnNewNews.current!.value,
          },
          pushOn: {
            newMessage: refs.pushOnNewMessage.current!.value,
            newSubstitution: refs.pushOnNewSubstitution.current!.value,
            newNews: refs.pushOnNewNews.current!.value,
          },
          considerNews: {
            newEvent: refs.considerNewsNewEvent.current!.value,
            newBlog: refs.considerNewsNewBlog.current!.value,
            newGallery: refs.considerNewsNewGallery.current!.value,
            fileChanged: refs.considerNewsFileChanged.current!.value,
          },
          mailbox: {
            deleteAfter: refs.mailboxDeleteAfter.current!.value,
            deleteAfterInBin: refs.mailboxDeleteAfterInBin.current!.value,
          },
          profile: {
            sessionTimeout: refs.profileSessionTimeout.current!.value,
          },
        },
      }),
      [personId, refs]
    ),
    useMemo(
      () => ({
        ACCOUNT_SETTINGS_MAILBOX_DELETE_AFTER_IN_BIN_INVALID:
          'invalid-mailbox-delete-after-in-bin',
        ACCOUNT_SETTINGS_MAILBOX_DELETE_AFTER_INVALID:
          'invalid-mailbox-delete-after',
        ACCOUNT_SETTINGS_PROFILE_SESSION_TIMEOUT_INVALID:
          'invalid-session-timeout',
      }),
      []
    ),
    useCallback(
      (state, errors, close) => {
        switch (state) {
          case FormState.Loading:
            return (
              <LoadingModal
                title='schulhof.administration.sections.persons.slices.persons.settings.modals.loading.title'
                description='schulhof.administration.sections.persons.slices.persons.settings.modals.loading.description'
              />
            );
          case FormState.Error: {
            const errorReasons = errors.flatMap((err) =>
              t(
                `schulhof.administration.sections.persons.slices.persons.settings.modals.error.reasons.${err}`
              )
            );

            return (
              <Modal onClose={close}>
                <Alert
                  variant={Variant.Error}
                  title='schulhof.administration.sections.persons.slices.persons.settings.modals.error.title'
                >
                  <p>
                    <T t='schulhof.administration.sections.persons.slices.persons.settings.modals.error.description' />
                  </p>
                  <ul>
                    {errorReasons.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </Alert>
                <ButtonGroup>
                  <Button onClick={close} t='generic.back' />
                </ButtonGroup>
              </Modal>
            );
          }
          case FormState.Success: {
            const own = isOwnProfile ? 'own' : 'other';

            return (
              <Modal onClose={close}>
                <Alert
                  variant={Variant.Success}
                  title='schulhof.administration.sections.persons.slices.persons.settings.modals.success.title'
                >
                  <p>
                    <T t='schulhof.administration.sections.persons.slices.persons.settings.modals.success.description' />
                  </p>
                </Alert>
                <ButtonGroup>
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
                            'paths.schulhof.administration.persons.persons',
                            `{${personId}}`,
                          ]
                    }
                    t={`schulhof.administration.sections.persons.slices.persons.settings.modals.success.button.${own}`}
                  />
                </ButtonGroup>
              </Modal>
            );
          }
        }
      },
      [t, isOwnProfile, personId]
    )
  );
}
