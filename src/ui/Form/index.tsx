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
    <TableRow>
      <TableHeader>
        <Label htmlFor={id} t={label} />
      </TableHeader>
      <TableCell>{children}</TableCell>
    </TableRow>
  );
};

export type TextFormRowProps = TextInputProps & Omit<FormRowProps, 'children'>;

export const TextFormRow = forwardRef<{ value: string }, TextFormRowProps>(
  function TextFormRow({ label, ...props }, ref) {
    const id = useId();

    return (
      <FormRow id={id} label={label}>
        <TextInput {...props} id={id} ref={ref} />
      </FormRow>
    );
  }
);

export type NumberFormRowProps = Omit<NumberInputProps, 'min' | 'max'> &
  Omit<FormRowProps, 'children'> & {
    unit?: TranslationsWithStringTypeAndNoVariables;
    min?: number;
    max?: number;
  };

export const NumberFormRow = forwardRef<{ value: number }, NumberFormRowProps>(
  function NumberFormRow({ label, unit, ...props }, ref) {
    const id = useId();

    return (
      <FormRow id={id} label={label}>
        <NumberInput {...props} id={id} ref={ref} />
        {unit ? <Label htmlFor={id} t={unit} /> : null}
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
        <Toggle {...props} id={id} ref={ref} />
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
  numberDefaultValue?: number;
};

export const NumberOrNullFormRow = forwardRef<
  { value: number | null },
  NumberOrNullFormRowProps
>(function NumberOrNullFormRow(
  {
    whetherLabel,
    numberLabel,
    defaultValue,
    unit,
    numberDefaultValue,
    ...props
  },
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
