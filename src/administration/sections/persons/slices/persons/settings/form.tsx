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
import { Input } from '#/ui/Input';
import { LoadingModal, Modal } from '#/ui/Modal';
import { Table } from '#/ui/Table';
import { Variant } from '#/ui/variants';
import { sleep } from '#/utils';
import {
  MutableRefObject,
  RefObject,
  useCallback,
  useEffect,
  useId,
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
          <Table.Body>
            <FormRow
              label='schulhof.administration.sections.persons.slices.persons.settings.form.emailOn.newMessage'
              type='checkbox'
              defaultValue={settings.emailOn.newMessage}
              ref={refs.emailOnNewMessage}
            />
            <FormRow
              label='schulhof.administration.sections.persons.slices.persons.settings.form.emailOn.newSubstitution'
              type='checkbox'
              defaultValue={settings.emailOn.newSubstitution}
              ref={refs.emailOnNewSubstitution}
            />
            <FormRow
              label='schulhof.administration.sections.persons.slices.persons.settings.form.emailOn.newNews'
              type='checkbox'
              defaultValue={settings.emailOn.newNews}
              ref={refs.emailOnNewNews}
            />
          </Table.Body>
        </Table>
        <Heading
          size='2'
          t='schulhof.administration.sections.persons.slices.persons.settings.form.pushOn.title'
        />
        <Table>
          <Table.Body>
            <FormRow
              label='schulhof.administration.sections.persons.slices.persons.settings.form.pushOn.newMessage'
              type='checkbox'
              defaultValue={settings.pushOn.newMessage}
              ref={refs.pushOnNewMessage}
            />
            <FormRow
              label='schulhof.administration.sections.persons.slices.persons.settings.form.pushOn.newSubstitution'
              type='checkbox'
              defaultValue={settings.pushOn.newSubstitution}
              ref={refs.pushOnNewSubstitution}
            />
            <FormRow
              label='schulhof.administration.sections.persons.slices.persons.settings.form.pushOn.newNews'
              type='checkbox'
              defaultValue={settings.pushOn.newNews}
              ref={refs.pushOnNewNews}
            />
          </Table.Body>
        </Table>
        <Heading
          size='2'
          t='schulhof.administration.sections.persons.slices.persons.settings.form.considerNews.title'
        />
        <Table>
          <Table.Body>
            <FormRow
              label='schulhof.administration.sections.persons.slices.persons.settings.form.considerNews.newEvent'
              type='checkbox'
              defaultValue={settings.considerNews.newEvent}
              ref={refs.considerNewsNewEvent}
            />
            <FormRow
              label='schulhof.administration.sections.persons.slices.persons.settings.form.considerNews.newBlog'
              type='checkbox'
              defaultValue={settings.considerNews.newBlog}
              ref={refs.considerNewsNewBlog}
            />
            <FormRow
              label='schulhof.administration.sections.persons.slices.persons.settings.form.considerNews.newGallery'
              type='checkbox'
              defaultValue={settings.considerNews.newGallery}
              ref={refs.considerNewsNewGallery}
            />
            <FormRow
              label='schulhof.administration.sections.persons.slices.persons.settings.form.considerNews.fileChanged'
              type='checkbox'
              defaultValue={settings.considerNews.fileChanged}
              ref={refs.considerNewsFileChanged}
            />
          </Table.Body>
        </Table>
      </Col>
      <Col w='6'>
        <Heading
          size='2'
          t='schulhof.administration.sections.persons.slices.persons.settings.form.mailbox.title'
        />
        <Table>
          <Table.Body>
            <MailboxDeleteAfterFormRow
              valueRef={refs.mailboxDeleteAfter}
              defaultValue={settings.mailbox.deleteAfter}
            />
            <MailboxDeleteAfterInBinFormRow
              valueRef={refs.mailboxDeleteAfterInBin}
              defaultValue={settings.mailbox.deleteAfterInBin}
            />
          </Table.Body>
        </Table>
        <Heading
          size='2'
          t='schulhof.administration.sections.persons.slices.persons.settings.form.profile.title'
        />
        <Table>
          <Table.Body>
            <MailboxSessionTimeoutFormRow
              inputRef={refs.profileSessionTimeout}
              defaultValue={settings.profile.sessionTimeout}
              maxSessionTimeout={maxSessionTimeout}
            />
          </Table.Body>
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
  const emailOnNewMessage = useRef<HTMLInputElement>(null);
  const emailOnNewSubstitution = useRef<HTMLInputElement>(null);
  const emailOnNewNews = useRef<HTMLInputElement>(null);
  const pushOnNewMessage = useRef<HTMLInputElement>(null);
  const pushOnNewSubstitution = useRef<HTMLInputElement>(null);
  const pushOnNewNews = useRef<HTMLInputElement>(null);
  const considerNewsNewEvent = useRef<HTMLInputElement>(null);
  const considerNewsNewBlog = useRef<HTMLInputElement>(null);
  const considerNewsNewGallery = useRef<HTMLInputElement>(null);
  const considerNewsFileChanged = useRef<HTMLInputElement>(null);
  const mailboxDeleteAfter = useRef<RefObject<HTMLInputElement> | null>(null);
  const mailboxDeleteAfterInBin = useRef<RefObject<HTMLInputElement> | null>(
    null
  );
  const profileSessionTimeout = useRef<HTMLInputElement>(null);

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
    emailOnNewMessage: RefObject<HTMLInputElement>;
    emailOnNewSubstitution: RefObject<HTMLInputElement>;
    emailOnNewNews: RefObject<HTMLInputElement>;
    pushOnNewMessage: RefObject<HTMLInputElement>;
    pushOnNewSubstitution: RefObject<HTMLInputElement>;
    pushOnNewNews: RefObject<HTMLInputElement>;
    considerNewsNewEvent: RefObject<HTMLInputElement>;
    considerNewsNewBlog: RefObject<HTMLInputElement>;
    considerNewsNewGallery: RefObject<HTMLInputElement>;
    considerNewsFileChanged: RefObject<HTMLInputElement>;
    mailboxDeleteAfter: MutableRefObject<RefObject<HTMLInputElement> | null>;
    mailboxDeleteAfterInBin: MutableRefObject<RefObject<HTMLInputElement> | null>;
    profileSessionTimeout: RefObject<HTMLInputElement>;
  },
  setFormState: (s: FormState) => void,
  setFormErrors: (e: readonly FormError[]) => void
) {
  const log = useLog();

  return useCallback(
    async function sendSettings() {
      const settings = {
        emailOn: {
          newMessage: refs.emailOnNewMessage.current!.value === 'on',
          newSubstitution: refs.emailOnNewSubstitution.current!.value === 'on',
          newNews: refs.emailOnNewNews.current!.value === 'on',
        },
        pushOn: {
          newMessage: refs.pushOnNewMessage.current!.value === 'on',
          newSubstitution: refs.pushOnNewSubstitution.current!.value === 'on',
          newNews: refs.pushOnNewNews.current!.value === 'on',
        },
        considerNews: {
          newEvent: refs.considerNewsNewEvent.current!.value === 'on',
          newBlog: refs.considerNewsNewBlog.current!.value === 'on',
          newGallery: refs.considerNewsNewGallery.current!.value === 'on',
          fileChanged: refs.considerNewsFileChanged.current!.value === 'on',
        },
        mailbox: {
          deleteAfter:
            refs.mailboxDeleteAfter.current === null
              ? null
              : parseInt(refs.mailboxDeleteAfter.current.current!.value),
          deleteAfterInBin:
            refs.mailboxDeleteAfterInBin.current === null
              ? null
              : parseInt(refs.mailboxDeleteAfterInBin.current.current!.value),
        },
        profile: {
          sessionTimeout: parseInt(refs.profileSessionTimeout.current!.value),
        },
      };

      setFormState(FormState.Loading);

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

const MailboxDeleteAfterFormRow = ({
  valueRef,
  defaultValue,
}: {
  valueRef: MutableRefObject<RefObject<HTMLInputElement> | null>;
  defaultValue: number | null;
}) => {
  const [isDisabled, setIsDisabled] = useState(defaultValue === null);
  const inputRef = useRef<HTMLInputElement>(null);
  const numberId = useId();
  const checkboxId = useId();

  useEffect(() => {
    if (defaultValue !== null) {
      valueRef.current = inputRef;
    }
  }, [defaultValue, valueRef]);

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
            <Input
              ref={inputRef}
              id={numberId}
              type='number'
              min={0}
              defaultValue={defaultValue ?? 0}
            />
            <T t='schulhof.administration.sections.persons.slices.persons.settings.form.mailbox.deleteAfterInBin.unit' />
          </>
        ) : null}
      </Table.Cell>
      <Table.Cell>
        <Input
          id={checkboxId}
          type='checkbox'
          defaultValue={defaultValue === null}
          onChange={(e) => {
            setIsDisabled(e.target.checked);
            if (e.target.checked) {
              valueRef.current = null;
            } else {
              valueRef.current = inputRef;
            }
          }}
        />
      </Table.Cell>
    </Table.Row>
  );
};

const MailboxDeleteAfterInBinFormRow = ({
  valueRef,
  defaultValue,
}: {
  valueRef: MutableRefObject<RefObject<HTMLInputElement> | null>;
  defaultValue: number | null;
}) => {
  const [isDisabled, setIsDisabled] = useState(defaultValue === null);
  const inputRef = useRef<HTMLInputElement>(null);
  const numberId = useId();
  const checkboxId = useId();

  useEffect(() => {
    if (defaultValue !== null) {
      valueRef.current = inputRef;
    }
  }, [defaultValue, valueRef]);

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
            <Input
              ref={inputRef}
              id={numberId}
              type='number'
              min={0}
              defaultValue={defaultValue ?? 0}
            />
            <T t='schulhof.administration.sections.persons.slices.persons.settings.form.mailbox.deleteAfterInBin.unit' />
          </>
        ) : null}
      </Table.Cell>
      <Table.Cell>
        <Input
          id={checkboxId}
          type='checkbox'
          defaultValue={defaultValue === null}
          onChange={(e) => {
            setIsDisabled(e.target.checked);
            if (e.target.checked) {
              valueRef.current = null;
            } else {
              valueRef.current = inputRef;
            }
          }}
        />
      </Table.Cell>
    </Table.Row>
  );
};

const MailboxSessionTimeoutFormRow = ({
  inputRef,
  defaultValue,
  maxSessionTimeout,
}: {
  inputRef: RefObject<HTMLInputElement>;
  defaultValue: number;
  maxSessionTimeout: number;
}) => {
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
        <Input
          ref={inputRef}
          id={id}
          type='number'
          min={0}
          max={maxSessionTimeout}
          defaultValue={defaultValue}
        />
        <T t='schulhof.administration.sections.persons.slices.persons.settings.form.profile.sessionTimeout.unit' />
      </Table.Cell>
    </Table.Row>
  );
};
