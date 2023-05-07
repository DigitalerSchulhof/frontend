'use client';

import { useLog } from '#/log/client';
import { sleep } from '#/utils';
import { AggregateServerActionError, ServerActionError } from '#/utils/client';
import { useCallback, useMemo, useState } from 'react';

export enum FormState {
  Idle,
  Loading,
  Error,
  Success,
}

export function useSend(
  action: () => Promise<void>,
  makeModalContent: (
    state: Exclude<FormState, FormState.Idle>,
    formErrors: readonly string[],
    close: () => void,
    serverActionErrors: readonly ServerActionError[]
  ) => JSX.Element
): [() => Promise<void>, JSX.Element | null] {
  const [formState, setFormState] = useState(FormState.Idle);
  const [formErrors, setFormErrors] = useState<readonly ServerActionError[]>(
    []
  );

  const log = useLog();

  const send = useCallback(
    async function send() {
      setFormState(FormState.Loading);

      const [res] = await Promise.allSettled([
        action(),
        // Avoid flashing the loading dialogue
        sleep(500),
      ]);

      if (res.status === 'rejected') {
        const err = res.reason;
        setFormState(FormState.Error);

        if (err instanceof ServerActionError) {
          setFormErrors([err]);
          return;
        } else if (err instanceof AggregateServerActionError) {
          setFormErrors(err.errors);
          return;
        }

        setFormErrors([new ServerActionError('INTERNAL_ERROR')]);
        log.error(err);

        return;
      }

      setFormState(FormState.Success);
    },
    [setFormState, setFormErrors, action, log]
  );

  const setIdle = useCallback(
    () => setFormState(FormState.Idle),
    [setFormState]
  );

  const modal = useMemo(() => {
    if (formState === FormState.Idle) {
      return null;
    }

    return makeModalContent(
      formState,
      formErrors.map((e) => e.code),
      setIdle,
      formErrors
    );
  }, [formState, setIdle, formErrors, makeModalContent]);

  return useMemo(() => [send, modal], [send, modal]);
}
