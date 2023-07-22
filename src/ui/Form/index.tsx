'use client';

import { T } from '#/i18n';
import type { TranslationsWithStringTypeAndNoVariables } from '#/i18n/translations';
import type {
  NumberInputProps,
  SelectInputProps,
  TextInputProps,
} from '#/ui/Input';
import { NumberInput, SelectInput, TextInput } from '#/ui/Input';
import type { ToggleProps } from '#/ui/Input/toggle';
import { Toggle } from '#/ui/Input/toggle';
import { TableCell, TableHeader, TableRow } from '#/ui/Table';
import React, {
  forwardRef,
  useCallback,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { styled } from 'styled-components';

export type FormProps = React.ComponentProps<'form'> & {
  submit: [(formData: FormData) => Promise<void>, React.ReactNode];
};

export const Form = forwardRef(function Form(
  { children, submit, ...props }: FormProps,
  ref: React.ForwardedRef<HTMLFormElement>
) {
  return (
    <form
      {...props}
      ref={ref}
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        void submit[0](formData);
      }}
    >
      {submit[1]}
      {children}
    </form>
  );
});

export const DisplayContentsForm = styled(Form)`
  display: contents;
`;

export const HiddenInput = (props: React.ComponentProps<'input'>) => (
  <input {...props} type='hidden' />
);

export type FormRowProps = {
  label: TranslationsWithStringTypeAndNoVariables;
  id?: string;
  children?: React.ReactNode;
};

export const FormRow = ({ label, id, children }: FormRowProps) => {
  return (
    <TableRow>
      <TableHeader>
        <Label htmlFor={id} t={label} />
      </TableHeader>
      <TableCell>{children}</TableCell>
    </TableRow>
  );
};

export type TextFormRowProps = TextInputProps & Omit<FormRowProps, 'children'>;

export const TextFormRow = forwardRef(function TextFormRow(
  { label, ...props }: TextFormRowProps,
  ref: React.ForwardedRef<{ value: string }>
) {
  const id = useId();

  return (
    <FormRow id={id} label={label}>
      <TextInput {...props} id={id} ref={ref} />
    </FormRow>
  );
});

export type NumberFormRowProps = Omit<NumberInputProps, 'min' | 'max'> &
  Omit<FormRowProps, 'children'> & {
    unit?: TranslationsWithStringTypeAndNoVariables;
    min?: number;
    max?: number;
  };

export const NumberFormRow = forwardRef(function NumberFormRow(
  { label, unit, ...props }: NumberFormRowProps,
  ref: React.ForwardedRef<{ value: number }>
) {
  const id = useId();

  return (
    <FormRow id={id} label={label}>
      <NumberInput {...props} id={id} ref={ref} />
      {unit ? <Label htmlFor={id} t={unit} /> : null}
    </FormRow>
  );
});

export type ToggleFormRowProps = ToggleProps & Omit<FormRowProps, 'children'>;

export const ToggleFormRow = forwardRef(function ToggleFormRow(
  { label, ...props }: ToggleFormRowProps,
  ref: React.ForwardedRef<{ value: boolean }>
) {
  const id = useId();

  return (
    <FormRow id={id} label={label}>
      <Toggle {...props} id={id} ref={ref} />
    </FormRow>
  );
});

export type SelectFormRowProps<Value extends string> = SelectInputProps<Value> &
  Omit<FormRowProps, 'children'>;

export const SelectFormRow = forwardRef(function SelectFormRow<
  Value extends string,
>(
  { label, ...props }: SelectFormRowProps<Value>,
  ref: React.ForwardedRef<{ value: Value }>
) {
  const id = useId();

  return (
    <FormRow id={id} label={label}>
      <SelectInput {...props} id={id} ref={ref} />
    </FormRow>
  );
});

export type NumberOrNullFormRowProps = Omit<
  NumberFormRowProps,
  'label' | 'defaultValue'
> & {
  whetherLabel: TranslationsWithStringTypeAndNoVariables;
  numberLabel: TranslationsWithStringTypeAndNoVariables;
  defaultValue?: number | null;
  numberDefaultValue?: number;
};

export const NumberOrNullFormRow = forwardRef(function NumberOrNullFormRow(
  {
    whetherLabel,
    numberLabel,
    defaultValue,
    unit,
    numberDefaultValue,
    ...props
  }: NumberOrNullFormRowProps,
  ref: React.ForwardedRef<{ value: number | null }>
) {
  const inputRef = useRef<{ value: number }>(null);
  const checkboxRef = useRef<{ value: boolean }>(null);

  const [isEnabled, setIsEnabled] = useState(defaultValue !== null);

  useImperativeHandle(
    ref,
    () => ({
      get value() {
        return isEnabled ? inputRef.current!.value : null;
      },
    }),
    [isEnabled]
  );

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
          defaultValue={defaultValue ?? numberDefaultValue ?? props.min ?? 0}
          unit={unit}
          {...props}
          ref={inputRef}
        />
      ) : null}
    </>
  );
});

export type LabelProps = Omit<
  React.ComponentProps<typeof StyledLabel>,
  'children'
> & {
  t: TranslationsWithStringTypeAndNoVariables;
};

export const Label = ({ t, ...props }: LabelProps) => {
  return (
    <StyledLabel {...props}>
      <T t={t} />
    </StyledLabel>
  );
};

export const StyledLabel = styled.label`
  line-height: inherit;
`;
