import { T } from '#/i18n';
import { TranslationsWithStringTypeAndNoVariables } from '#/i18n/translations';
import { useLog } from '#/log/client';
import {
  NumberInput,
  NumberInputProps,
  TextInput,
  TextInputProps,
} from '#/ui/Input';
import { Toggle, ToggleProps } from '#/ui/Input/toggle';
import { Table } from '#/ui/Table';
import { sleep } from '#/utils';
import { AggregateServerActionError, ServerActionError } from '#/utils/client';
import React, {
  FormEventHandler,
  forwardRef,
  useCallback,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { styled } from 'styled-components';

export enum FormState {
  Idle,
  Loading,
  Error,
  Success,
}

export interface FormProps<R>
  extends Omit<React.ComponentProps<'form'>, 'action'> {
  action: () => Promise<R>;
  makeLoading: (close: () => void) => JSX.Element;
  makeError: (
    close: () => void,
    actionErrorCodes: readonly string[],
    actionErrors: readonly ServerActionError[]
  ) => JSX.Element;
  makeSuccess: (close: () => void, data: R) => JSX.Element;
}

export const Form = <R,>({
  children,
  action,
  makeLoading,
  makeError,
  makeSuccess,
  ...props
}: FormProps<R>) => {
  const [formState, setFormState] = useState(FormState.Idle);
  const [actionRes, setActionRes] = useState<R | null>(null);
  const [actionErrors, setActionErrors] = useState<
    readonly ServerActionError[]
  >([]);

  const setIdle = useCallback(
    () => setFormState(FormState.Idle),
    [setFormState]
  );

  const log = useLog();

  const modal = useMemo(() => {
    switch (formState) {
      case FormState.Idle:
        return null;
      case FormState.Loading:
        return makeLoading(setIdle);
      case FormState.Error:
        return makeError(
          setIdle,
          actionErrors.map((e) => e.code),
          actionErrors
        );
      case FormState.Success:
        return makeSuccess(setIdle, actionRes!);
    }
  }, [
    formState,
    setIdle,
    actionErrors,
    actionRes,
    makeLoading,
    makeError,
    makeSuccess,
  ]);

  return (
    <form
      onSubmit={useCallback<FormEventHandler<HTMLFormElement>>(
        (e) => {
          e.preventDefault();

          if (formState !== FormState.Idle) {
            log.error('Form submitted while not idle');
            return;
          }

          void (async () => {
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
          })();
        },
        [formState, setFormState, setActionErrors, action, log]
      )}
      {...props}
    >
      {modal}
      {children}
    </form>
  );
};

export const DisplayContentsForm = styled(Form)`
  display: contents;
`;

export type FormRowProps = {
  label: TranslationsWithStringTypeAndNoVariables;
  id?: string;
  children?: React.ReactNode;
};

export const FormRow = ({ label, id, children }: FormRowProps) => {
  return (
    <Table.Row>
      <Table.Header>
        <Label htmlFor={id}>
          <T t={label} />
        </Label>
      </Table.Header>
      <Table.Cell>{children}</Table.Cell>
    </Table.Row>
  );
};

export type TextFormRowProps = TextInputProps & Omit<FormRowProps, 'children'>;

export const TextFormRow = forwardRef<{ value: string }, TextFormRowProps>(
  function TextFormRow({ label, ...props }, ref) {
    const id = useId();

    return (
      <FormRow id={id} label={label}>
        <TextInput id={id} {...props} ref={ref} />
      </FormRow>
    );
  }
);

export type NumberFormRowProps = NumberInputProps &
  Omit<FormRowProps, 'children'> & {
    unit?: TranslationsWithStringTypeAndNoVariables;
  };

export const NumberFormRow = forwardRef<{ value: number }, NumberFormRowProps>(
  function NumberFormRow({ label, unit, ...props }, ref) {
    const id = useId();

    return (
      <FormRow id={id} label={label}>
        <NumberInput id={id} {...props} ref={ref} />
        {unit ? (
          <Label htmlFor={id}>
            <T t={unit} />
          </Label>
        ) : null}
      </FormRow>
    );
  }
);

export type ToggleFormRowProps = ToggleProps & Omit<FormRowProps, 'children'>;

export const ToggleFormRow = forwardRef<{ value: boolean }, ToggleFormRowProps>(
  function ToggleFormRow({ label, ...props }, ref) {
    const id = useId();

    return (
      <FormRow id={id} label={label}>
        <Toggle id={id} {...props} ref={ref} />
      </FormRow>
    );
  }
);

export type NumberOrNullFormRowProps = Omit<
  NumberFormRowProps,
  'label' | 'defaultValue'
> & {
  whetherLabel: TranslationsWithStringTypeAndNoVariables;
  numberLabel: TranslationsWithStringTypeAndNoVariables;
  defaultValue?: number | null;
};

export const NumberOrNullFormRow = forwardRef<
  { value: number | null },
  NumberOrNullFormRowProps
>(function NumberOrNullFormRow(
  { whetherLabel, numberLabel, defaultValue, unit, ...props },
  ref
) {
  const inputRef = useRef<{ value: number }>(null);
  const checkboxRef = useRef<{ value: boolean }>(null);

  const [isEnabled, setIsEnabled] = useState(defaultValue !== null);

  useImperativeHandle(ref, () => ({
    get value() {
      return isEnabled ? inputRef.current!.value : null;
    },
  }));

  return (
    <>
      <ToggleFormRow
        label={whetherLabel}
        defaultValue={defaultValue !== null}
        ref={checkboxRef}
        onChange={useCallback(
          (checked: boolean) => {
            setIsEnabled(checked);
          },
          [setIsEnabled]
        )}
      />
      {isEnabled ? (
        <NumberFormRow
          label={numberLabel}
          defaultValue={defaultValue ?? 0}
          unit={unit}
          {...props}
          ref={inputRef}
        />
      ) : null}
    </>
  );
});

export const Label = styled.label`
  line-height: inherit;
`;
