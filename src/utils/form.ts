import { useLog } from '#/log/client';
import type { WrappedActionResult } from '#/utils/action';
import {
  AggregateServerActionError,
  ServerActionError,
  unwrapAction,
} from '#/utils/client';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { useCallback, useMemo, useState, useTransition } from 'react';

export enum ActionState {
  Idle,
  // Loading state is signified by 'isPending' in useTransition
  Error,
  Success,
}

export function useSend<A extends readonly unknown[], R>(
  action: (...args: A) => Promise<WrappedActionResult<R>>,
  makeLoadingModalContent: () => JSX.Element,
  makeErrorModalContent: (
    close: () => void,
    actionErrorCodes: readonly string[],
    actionErrors: readonly ServerActionError[]
  ) => JSX.Element,
  makeSuccessModalContent: (data: R) => JSX.Element
): readonly [(...args: A) => Promise<void>, JSX.Element | null] {
  const [isPending, startTransition] = useTransition();

  const [actionState, setActionState] = useState(ActionState.Idle);
  const [actionRes, setActionRes] = useState<R | null>(null);
  const [actionErrors, setActionErrors] = useState<
    readonly ServerActionError[]
  >([]);

  const log = useLog();

  const send = useCallback(
    async function send(...args: A) {
      startTransition(async () => {
        let res;
        try {
          res = await unwrapAction(action(...args));
        } catch (err) {
          if (isRedirectError(err)) {
            throw err;
          }

          setActionState(ActionState.Error);

          if (err instanceof ServerActionError) {
            if (err.code === 'INTERNAL_ERROR') {
              log.error(err);
            }

            setActionErrors([err]);
            return;
          } else if (err instanceof AggregateServerActionError) {
            err.errors.forEach((e) => {
              if (e.code === 'INTERNAL_ERROR') {
                log.error(e);
              }
            });

            setActionErrors(err.errors);
            return;
          }

          log.error(err);
          setActionErrors([new ServerActionError('INTERNAL_ERROR')]);

          return;
        }

        setActionState(ActionState.Success);
        setActionRes(res);
      });
    },
    [setActionState, setActionErrors, action, log]
  );

  const setIdle = useCallback(
    () => setActionState(ActionState.Idle),
    [setActionState]
  );

  const modal = useMemo(() => {
    if (isPending) return makeLoadingModalContent();

    switch (actionState) {
      case ActionState.Idle:
        return null;
      case ActionState.Error:
        return makeErrorModalContent(
          setIdle,
          actionErrors.map((e) => e.code),
          actionErrors
        );
      case ActionState.Success:
        return makeSuccessModalContent(actionRes!);
    }
  }, [
    isPending,
    actionState,
    setIdle,
    actionErrors,
    actionRes,
    makeLoadingModalContent,
    makeErrorModalContent,
    makeSuccessModalContent,
  ]);

  return useMemo(() => [send, modal], [send, modal]);
}
