'use client';

import {
  SettingsInput,
  SettingsOutputNotOk,
} from '#/app/api/schulhof/administration/persons/persons/settings/route';
import { PersonSettings } from '#/backend/repositories/content/person';
import {
  PERSON_MAILBOX_DELETE_AFTER_INVALID,
  PERSON_MAILBOX_DELETE_AFTER_IN_BIN_INVALID,
  PERSON_PROFILE_SESSION_TIMEOUT_INVALID,
} from '#/backend/validators/content/person';
import { T } from '#/i18n';
import { useT } from '#/i18n/client';
import { useLog } from '#/log/client';
import { Alert } from '#/ui/Alert';
import { Button, ButtonGroup } from '#/ui/Button';
import { Col } from '#/ui/Col';
import { DisplayContentsForm, FormRow, Label } from '#/ui/Form';
import { Heading } from '#/ui/Heading';
import { NumberInput, Toggle } from '#/ui/Input';
import { LoadingModal, Modal } from '#/ui/Modal';
import { Table } from '#/ui/Table';
import { Variant } from '#/ui/variants';
import { sleep } from '#/utils';
import {
  RefObject,
  forwardRef,
  useCallback,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

enum FormState {
  Idle,
  Loading,
  Error,
  Success,
}

export enum FormError {
  InternalError = 'internal-error',
  InvalidMailboxDeleteAfter = 'invalid-mailbox-delete-after',
  InvalidMailboxDeleteAfterInBin = 'invalid-mailbox-delete-after-in-bin',
  InvalidSessionTimeout = 'invalid-session-timeout',
}

export const SettingsForm = ({
  isOwnProfile,
  personId,
  settings,
  maxSessionTimeout,
}: {
  isOwnProfile: boolean;
  personId: string;
  settings: PersonSettings;
  maxSessionTimeout: number;
}) => {
  const [formState, setFormState] = useState<FormState>(FormState.Idle);
  const [formErrors, setFormErrors] = useState<readonly FormError[]>([]);

  const own = isOwnProfile ? 'own' : 'other';

  const refs = useRefs();

  const sendSettings = useSendSettings(
    personId,
    refs,
    setFormState,
    setFormErrors
  );

  const modal = useSettingsStateModal(
    isOwnProfile,
    personId,
    formState,
    formErrors,
    setFormState
  );

  return (
    <DisplayContentsForm onSubmit={sendSettings}>
      {modal}
      <Col w='6'>
        <Heading
          size='2'
          t='schulhof.administration.sections.persons.slices.persons.settings.form.emailOn.title'
        />
        <Table>
          <FormRow
            label='schulhof.administration.sections.persons.slices.persons.settings.form.emailOn.newMessage'
            type='toggle'
            defaultValue={settings.emailOn.newMessage}
            ref={refs.emailOnNewMessage}
          />
          <FormRow
            label='schulhof.administration.sections.persons.slices.persons.settings.form.emailOn.newSubstitution'
            type='toggle'
            defaultValue={settings.emailOn.newSubstitution}
            ref={refs.emailOnNewSubstitution}
          />
          <FormRow
            label='schulhof.administration.sections.persons.slices.persons.settings.form.emailOn.newNews'
            type='toggle'
            defaultValue={settings.emailOn.newNews}
            ref={refs.emailOnNewNews}
          />
        </Table>
        <Heading
          size='2'
          t='schulhof.administration.sections.persons.slices.persons.settings.form.pushOn.title'
        />
        <Table>
          <FormRow
            label='schulhof.administration.sections.persons.slices.persons.settings.form.pushOn.newMessage'
            type='toggle'
            defaultValue={settings.pushOn.newMessage}
            ref={refs.pushOnNewMessage}
          />
          <FormRow
            label='schulhof.administration.sections.persons.slices.persons.settings.form.pushOn.newSubstitution'
            type='toggle'
            defaultValue={settings.pushOn.newSubstitution}
            ref={refs.pushOnNewSubstitution}
          />
          <FormRow
            label='schulhof.administration.sections.persons.slices.persons.settings.form.pushOn.newNews'
            type='toggle'
            defaultValue={settings.pushOn.newNews}
            ref={refs.pushOnNewNews}
          />
        </Table>
        <Heading
          size='2'
          t='schulhof.administration.sections.persons.slices.persons.settings.form.considerNews.title'
        />
        <Table>
          <FormRow
            label='schulhof.administration.sections.persons.slices.persons.settings.form.considerNews.newEvent'
            type='toggle'
            defaultValue={settings.considerNews.newEvent}
            ref={refs.considerNewsNewEvent}
          />
          <FormRow
            label='schulhof.administration.sections.persons.slices.persons.settings.form.considerNews.newBlog'
            type='toggle'
            defaultValue={settings.considerNews.newBlog}
            ref={refs.considerNewsNewBlog}
          />
          <FormRow
            label='schulhof.administration.sections.persons.slices.persons.settings.form.considerNews.newGallery'
            type='toggle'
            defaultValue={settings.considerNews.newGallery}
            ref={refs.considerNewsNewGallery}
          />
          <FormRow
            label='schulhof.administration.sections.persons.slices.persons.settings.form.considerNews.fileChanged'
            type='toggle'
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
        <Table columns='1fr auto auto'>
          <MailboxDeleteAfterFormRow
            defaultValue={settings.mailbox.deleteAfter}
            ref={refs.mailboxDeleteAfter}
          />
          <MailboxDeleteAfterInBinFormRow
            defaultValue={settings.mailbox.deleteAfterInBin}
            ref={refs.mailboxDeleteAfterInBin}
          />
        </Table>
        <Heading
          size='2'
          t='schulhof.administration.sections.persons.slices.persons.settings.form.profile.title'
        />
        <Table>
          <MailboxSessionTimeoutFormRow
            defaultValue={settings.profile.sessionTimeout}
            maxSessionTimeout={maxSessionTimeout}
            ref={refs.profileSessionTimeout}
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

function useSendSettings(
  personId: string,
  refs: {
    emailOnNewMessage: RefObject<{ value: boolean }>;
    emailOnNewSubstitution: RefObject<{ value: boolean }>;
    emailOnNewNews: RefObject<{ value: boolean }>;
    pushOnNewMessage: RefObject<{ value: boolean }>;
    pushOnNewSubstitution: RefObject<{ value: boolean }>;
    pushOnNewNews: RefObject<{ value: boolean }>;
    considerNewsNewEvent: RefObject<{ value: boolean }>;
    considerNewsNewBlog: RefObject<{ value: boolean }>;
    considerNewsNewGallery: RefObject<{ value: boolean }>;
    considerNewsFileChanged: RefObject<{ value: boolean }>;
    mailboxDeleteAfter: RefObject<{ value: number | null }>;
    mailboxDeleteAfterInBin: RefObject<{ value: number | null }>;
    profileSessionTimeout: RefObject<{ value: number }>;
  },
  setFormState: (s: FormState) => void,
  setFormErrors: (e: readonly FormError[]) => void
) {
  const log = useLog();

  return useCallback(
    async function sendSettings() {
      setFormState(FormState.Loading);

      const settings = {
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
      };

      const [res] = await Promise.all([
        fetch('/api/schulhof/administration/persons/persons/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            personId,
            settings,
          } satisfies SettingsInput),
        }),
        // Avoid flashing the loading dialogue
        sleep(500),
      ]);

      if (!res.ok) {
        const bodyString = await res.text();
        setFormState(FormState.Error);
        let body: SettingsOutputNotOk;
        try {
          body = JSON.parse(bodyString);
        } catch (e) {
          setFormErrors([FormError.InternalError]);
          if (e instanceof SyntaxError) {
            log.error('Unknown error while changing settings', {
              personId,
              settings,
              status: res.status,
              body: bodyString,
            });
            return;
          }

          throw e;
        }

        const errors: FormError[] = [];
        for (const error of body.errors) {
          switch (error.code) {
            case PERSON_MAILBOX_DELETE_AFTER_INVALID:
              errors.push(FormError.InvalidMailboxDeleteAfter);
              break;
            case PERSON_MAILBOX_DELETE_AFTER_IN_BIN_INVALID:
              errors.push(FormError.InvalidMailboxDeleteAfterInBin);
              break;
            case PERSON_PROFILE_SESSION_TIMEOUT_INVALID:
              errors.push(FormError.InvalidSessionTimeout);
              break;
            default:
              if (!errors.includes(FormError.InternalError)) {
                errors.push(FormError.InternalError);
              }

              log.error('Unknown error while changing settings', {
                personId,
                settings,
                status: res.status,
                body,
                code: error.code,
              });
              break;
          }
        }

        setFormErrors(errors);
        return;
      }

      setFormState(FormState.Success);
    },
    [personId, refs, setFormState, setFormErrors, log]
  );
}

function useSettingsStateModal(
  isOwnProfile: boolean,
  personId: string,
  state: FormState,
  formErrors: readonly FormError[],
  setFormState: (s: FormState) => void
) {
  const { t } = useT();

  const setIdle = useCallback(
    () => setFormState(FormState.Idle),
    [setFormState]
  );

  return useMemo(() => {
    switch (state) {
      case FormState.Idle:
        return null;
      case FormState.Loading:
        return (
          <LoadingModal
            title='schulhof.administration.sections.persons.slices.persons.settings.modals.loading.title'
            description='schulhof.administration.sections.persons.slices.persons.settings.modals.loading.description'
          />
        );
      case FormState.Error: {
        const errorReasons = formErrors.flatMap((err) =>
          t(
            `schulhof.administration.sections.persons.slices.persons.settings.modals.error.reasons.${err}`
          )
        );

        return (
          <Modal onClose={setIdle}>
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
              <Button onClick={setIdle} t='generic.back' />
            </ButtonGroup>
          </Modal>
        );
      }
      case FormState.Success: {
        const own = isOwnProfile ? 'own' : 'other';

        return (
          <Modal onClose={setIdle}>
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
  }, [isOwnProfile, personId, state, formErrors, setIdle, t]);
}

const MailboxDeleteAfterFormRow = forwardRef<
  { value: number | null },
  {
    defaultValue: number | null;
  }
>(function MailboxDeleteAfterFormRow({ defaultValue }, ref) {
  const inputRef = useRef<{ value: number }>(null);
  const checkboxRef = useRef<{ value: boolean }>(null);

  const [isDisabled, setIsDisabled] = useState(defaultValue === null);
  const numberId = useId();
  const checkboxId = useId();

  useImperativeHandle(ref, () => ({
    get value() {
      return isDisabled ? null : inputRef.current!.value;
    },
  }));

  return (
    <Table.Row>
      <Table.Header>
        <Label htmlFor={isDisabled ? checkboxId : numberId}>
          <T
            t={`schulhof.administration.sections.persons.slices.persons.settings.form.mailbox.deleteAfter.title.${
              isDisabled ? 'disabled' : 'days'
            }`}
          />
        </Label>
      </Table.Header>
      <Table.Cell>
        {!isDisabled ? (
          <>
            <NumberInput
              ref={inputRef}
              id={numberId}
              min={0}
              defaultValue={defaultValue ?? 0}
            />
            <T t='schulhof.administration.sections.persons.slices.persons.settings.form.mailbox.deleteAfterInBin.unit' />
          </>
        ) : null}
      </Table.Cell>
      <Table.Cell>
        <Toggle
          id={checkboxId}
          defaultValue={defaultValue === null}
          ref={checkboxRef}
          onChange={useCallback(
            (checked: boolean) => {
              setIsDisabled(checked);
            },
            [setIsDisabled]
          )}
        />
      </Table.Cell>
    </Table.Row>
  );
});

const MailboxDeleteAfterInBinFormRow = forwardRef<
  { value: number | null },
  {
    defaultValue: number | null;
  }
>(function MailboxDeleteAfterInBinFormRow({ defaultValue }, ref) {
  const inputRef = useRef<{ value: number }>(null);
  const checkboxRef = useRef<{ value: boolean }>(null);

  const [isDisabled, setIsDisabled] = useState(defaultValue === null);
  const numberId = useId();
  const checkboxId = useId();

  useImperativeHandle(ref, () => ({
    get value() {
      return isDisabled ? null : inputRef.current!.value;
    },
  }));

  return (
    <Table.Row>
      <Table.Header>
        <Label htmlFor={isDisabled ? checkboxId : numberId}>
          <T
            t={`schulhof.administration.sections.persons.slices.persons.settings.form.mailbox.deleteAfterInBin.title.${
              isDisabled ? 'disabled' : 'days'
            }`}
          />
        </Label>
      </Table.Header>
      <Table.Cell>
        {!isDisabled ? (
          <>
            <NumberInput
              ref={inputRef}
              id={numberId}
              min={0}
              defaultValue={defaultValue ?? 0}
            />
            <T t='schulhof.administration.sections.persons.slices.persons.settings.form.mailbox.deleteAfterInBin.unit' />
          </>
        ) : null}
      </Table.Cell>
      <Table.Cell>
        <Toggle
          id={checkboxId}
          defaultValue={defaultValue === null}
          ref={checkboxRef}
          onChange={useCallback(
            (checked: boolean) => {
              setIsDisabled(checked);
            },
            [setIsDisabled]
          )}
        />
      </Table.Cell>
    </Table.Row>
  );
});

const MailboxSessionTimeoutFormRow = forwardRef<
  { value: number },
  {
    defaultValue: number;
    maxSessionTimeout: number;
  }
>(function MailboxSessionTimeoutFormRow(
  { defaultValue, maxSessionTimeout },
  ref
) {
  const id = useId();

  return (
    <Table.Row>
      <Table.Header>
        <Label htmlFor={id}>
          <T
            t={`schulhof.administration.sections.persons.slices.persons.settings.form.profile.sessionTimeout.title`}
          />
        </Label>
      </Table.Header>
      <Table.Cell>
        <NumberInput
          ref={ref}
          id={id}
          min={0}
          max={maxSessionTimeout}
          defaultValue={defaultValue}
        />
        <T t='schulhof.administration.sections.persons.slices.persons.settings.form.profile.sessionTimeout.unit' />
      </Table.Cell>
    </Table.Row>
  );
});
