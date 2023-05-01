'use client';

import { useLog } from '#/log/client';
import { identity, sleep } from '#/utils';
import { useCallback, useMemo, useState } from 'react';

export enum FormState {
  Idle,
  Loading,
  Error,
  Success,
}

export function useSend<
  Input extends Record<string, unknown>,
  OutputOk extends {
    code: 'OK';
  },
  OutputNotOk extends {
    code: 'NOT_OK';
    errors: { code: string }[];
  },
  FormError extends string
>(
  endpoint: string,
  setFormState: (state: FormState) => void,
  makeInput: () => Input,
  errorCodeMap: Record<OutputNotOk['errors'][number]['code'], FormError>,
  onSuccess?: (body: OutputOk) => void,
  onError?: (body: OutputNotOk) => void,
  logOptions?: {
    /**
     * @default true
     */
    attachInput?: boolean;
    /**
     * @default identity
     */
    editInput?: (input: Input) => unknown;
  }
): [() => Promise<void>, readonly FormError[]] {
  const [formErrors, setFormErrors] = useState<readonly FormError[]>([]);

  const makeLogInput = useCallback(
    (input: Input) => {
      const { attachInput = false, editInput = identity } = logOptions ?? {};

      if (!attachInput) {
        return {};
      }

      return { input: editInput(input) };
    },
    [logOptions]
  );

  const log = useLog();

  const send = useCallback(
    async function send() {
      setFormState(FormState.Loading);

      const input = makeInput();

      const [res] = await Promise.all([
        fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input),
        }),
        // Avoid flashing the loading dialogue
        sleep(500),
      ]);

      if (!res.ok) {
        const bodyString = await res.text();
        setFormState(FormState.Error);
        let body: OutputNotOk;
        try {
          body = JSON.parse(bodyString);
        } catch (e) {
          setFormErrors(['internal-error' as FormError]);
          if (e instanceof SyntaxError) {
            log.error(`Unknown error requesting '${endpoint}'`, {
              endpoint,
              status: res.status,
              body: bodyString,
              ...makeLogInput(input),
            });
            return;
          }

          throw e;
        }

        const errors: FormError[] = [];
        for (const error of body.errors) {
          if (error.code in errorCodeMap) {
            // @ts-expect-error -- Object access
            errors.push(errorCodeMap[error.code]);
            continue;
          }

          if (!errors.includes('internal-error' as FormError)) {
            errors.push('internal-error' as FormError);
          }

          log.error(`Unknown error requesting '${endpoint}'`, {
            endpoint,
            status: res.status,
            body,
            code: error.code,
            ...makeLogInput(input),
          });
        }

        setFormErrors(errors);
        onError?.(body);
        return;
      }

      setFormState(FormState.Success);
      onSuccess?.(await res.json());
    },
    [
      endpoint,
      setFormState,
      setFormErrors,
      makeInput,
      errorCodeMap,
      onSuccess,
      onError,
      log,
      makeLogInput,
    ]
  );

  return useMemo(() => [send, formErrors], [send, formErrors]);
}
