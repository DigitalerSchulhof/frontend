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

export function useSend<R>(
  action: () => Promise<R>,
  makeLoadingModalContent: (close: () => void) => JSX.Element,
  makeErrorModalContent: (
    close: () => void,
    actionErrorCodes: readonly string[],
    actionErrors: readonly ServerActionError[]
  ) => JSX.Element,
  makeSuccessModalContent: (close: () => void, data: R) => JSX.Element
): [() => Promise<void>, JSX.Element | null] {
  const [formState, setFormState] = useState(FormState.Idle);
  const [actionRes, setActionRes] = useState<R | null>(null);
  const [actionErrors, setActionErrors] = useState<
    readonly ServerActionError[]
  >([]);

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
          setActionErrors([err]);
          return;
        } else if (err instanceof AggregateServerActionError) {
          setActionErrors(err.errors);
          return;
        }

        setActionErrors([new ServerActionError('INTERNAL_ERROR')]);
        log.error(err);

        return;
      }

      setFormState(FormState.Success);
      setActionRes(res.value);
    },
    [setFormState, setActionErrors, action, log]
  );

  const setIdle = useCallback(
    () => setFormState(FormState.Idle),
    [setFormState]
  );

  const modal = useMemo(() => {
    switch (formState) {
      case FormState.Idle:
        return null;
      case FormState.Loading:
        return makeLoadingModalContent(setIdle);
      case FormState.Error:
        return makeErrorModalContent(
          setIdle,
          actionErrors.map((e) => e.code),
          actionErrors
        );
      case FormState.Success:
        return makeSuccessModalContent(setIdle, actionRes!);
    }
  }, [
    formState,
    setIdle,
    actionErrors,
    actionRes,
    makeLoadingModalContent,
    makeErrorModalContent,
    makeSuccessModalContent,
  ]);

  return useMemo(() => [send, modal], [send, modal]);
}
