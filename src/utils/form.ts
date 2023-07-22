import { useLog } from '#/log/client';
import type { WrappedActionResult } from '#/utils/action';
import {
  AggregateServerActionError,
  ServerActionError,
  unwrapAction,
} from '#/utils/client';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { useCallback, useMemo, useState, useTransition } from 'react';

export enum FormState {
  Idle,
  // Loading state is signified by 'isPending' in useTransition
  Error,
  Success,
}

export function useSend<R>(
  action: (formData: FormData) => Promise<WrappedActionResult<R>>,
  makeLoadingModalContent: () => JSX.Element,
  makeErrorModalContent: (
    close: () => void,
    actionErrorCodes: readonly string[],
    actionErrors: readonly ServerActionError[]
  ) => JSX.Element,
  makeSuccessModalContent: (close: () => void, data: R) => JSX.Element
): [(formData: FormData) => Promise<void>, JSX.Element | null] {
  const [isPending, startTransition] = useTransition();

  const [formState, setFormState] = useState(FormState.Idle);
  const [actionRes, setActionRes] = useState<R | null>(null);
  const [actionErrors, setActionErrors] = useState<
    readonly ServerActionError[]
  >([]);

  const log = useLog();

  const send = useCallback(
    async function send(formData: FormData) {
      startTransition(async () => {
        let res;
        try {
          res = await unwrapAction(action(formData));
        } catch (err) {
          if (isRedirectError(err)) {
            throw err;
          }

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
        setActionRes(res);
      });
    },
    [setFormState, setActionErrors, action, log]
  );

  const setIdle = useCallback(
    () => setFormState(FormState.Idle),
    [setFormState]
  );

  const modal = useMemo(() => {
    if (isPending) return makeLoadingModalContent();

    switch (formState) {
      case FormState.Idle:
        return null;
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
    isPending,
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
