'use client';

import { T } from '#/i18n';
import { TranslationsWithStringTypeAndNoVariables } from '#/i18n/translations';
import React, {
  FormEventHandler,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import { css, styled } from 'styled-components';

export { Toggle } from './toggle';
export { ToggleButton } from './toggle-button';

export type InputProps = Omit<
  React.ComponentProps<'input'>,
  'type' | 'defaultValue' | 'defaultChecked' | 'onInput'
>;

export type SelectProps = Omit<
  React.ComponentProps<'select'>,
  'defaultValue' | 'onInput'
>;

export type TextInputProps = InputProps & {
  defaultValue?: string;
  /**
   * @default 'text'
   */
  type?: 'text' | 'password';
  onInput?: (value: string) => void;
};

export const TextInput = forwardRef(function TextInput(
  { type = 'text', onInput, ...props }: TextInputProps,
  ref: React.ForwardedRef<{ value: string }>
) {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    get value() {
      return inputRef.current!.value;
    },
  }));

  const onInputHandler = useCallback<FormEventHandler<HTMLInputElement>>(
    (e) => {
      onInput?.(e.currentTarget.value);
    },
    [onInput]
  );

  return (
    <StyledInput
      ref={inputRef}
      type={type}
      onInput={onInputHandler}
      {...props}
    />
  );
});

export type NumberInputProps = InputProps & {
  defaultValue?: number;
  onInput?: (value: number) => void;
};

export const NumberInput = forwardRef(function NumberInput(
  { onInput, ...props }: NumberInputProps,
  ref: React.ForwardedRef<{ value: number }>
) {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    get value() {
      return inputRef.current!.valueAsNumber;
    },
  }));

  const onInputHandler = useCallback<FormEventHandler<HTMLInputElement>>(
    (e) => {
      onInput?.(e.currentTarget.valueAsNumber);
    },
    [onInput]
  );

  return (
    <StyledInput
      ref={inputRef}
      type='number'
      onInput={onInputHandler}
      {...props}
    />
  );
});

export type SelectInputProps<Value extends string> = SelectProps & {
  defaultValue?: Value;
  onInput?: (value: Value) => void;
  values: Record<Value, TranslationsWithStringTypeAndNoVariables>;
};

export const SelectInput = forwardRef(function SelectInput<
  Value extends string
>(
  { onInput, values, ...props }: SelectInputProps<Value>,
  ref: React.ForwardedRef<{ value: Value }>
) {
  const inputRef = useRef<HTMLSelectElement>(null);

  useImperativeHandle(ref, () => ({
    get value() {
      return inputRef.current!.value as Value;
    },
  }));

  const onInputHandler = useCallback<FormEventHandler<HTMLSelectElement>>(
    (e) => {
      onInput?.(e.currentTarget.value as Value);
    },
    [onInput]
  );

  return (
    <StyledSelect ref={inputRef} onInput={onInputHandler} {...props}>
      {Object.keys(values).map((value) => (
        <option key={value} value={value}>
          {/* @ts-expect-error -- Object access */}
          <T t={values[value]} />
        </option>
      ))}
    </StyledSelect>
  );
});

const InputStyles = css`
  font-weight: normal;
  background-color: #212121;
  padding: 5px 7px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  width: 100%;
  border: none;
`;

export const StyledInput = styled.input`
  ${InputStyles}
`;

export const StyledSelect = styled.select`
  ${InputStyles}
`;
