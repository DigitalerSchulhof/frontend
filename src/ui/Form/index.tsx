'use client';

import { T } from '#/i18n';
import { TranslationsWithStringTypeAndNoVariables } from '#/i18n/translations';
import {
  NumberInput,
  NumberInputProps,
  TextInput,
  TextInputProps,
} from '#/ui/Input';
import { Toggle, ToggleProps } from '#/ui/Input/toggle';
import { Table } from '#/ui/Table';
import React, {
  forwardRef,
  useCallback,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { styled } from 'styled-components';

export interface FormProps extends React.HTMLAttributes<HTMLFormElement> {}

export const Form = forwardRef<HTMLFormElement, FormProps>(function Form(
  { children, ...props },
  ref
) {
  return (
    <form
      {...props}
      ref={ref}
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit?.(e);
      }}
    >
      {children}
    </form>
  );
});

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
