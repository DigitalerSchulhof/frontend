'use client';

import {
  ClassAttributes,
  FormEventHandler,
  InputHTMLAttributes,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import { styled } from 'styled-components';

export { Toggle } from './toggle';
export { ToggleButton } from './toggle-button';

export type InputProps = ClassAttributes<HTMLInputElement> &
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'defaultValue' | 'defaultChecked' | 'onInput'
  >;

export type TextInputProps = InputProps & {
  defaultValue?: string;
  /**
   * @default 'text'
   */
  type?: 'text' | 'password';
  onInput?: (value: string) => void;
};

export const TextInput = forwardRef<{ value: string }, TextInputProps>(
  function TextInput({ type = 'text', onInput, ...props }, ref) {
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
  }
);

export type NumberInputProps = InputProps & {
  defaultValue?: number;
  onInput?: (value: number) => void;
};

export const NumberInput = forwardRef<{ value: number }, NumberInputProps>(
  function NumberInput({ onInput, ...props }, ref) {
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
  }
);

export const StyledInput = styled.input`
  font-weight: normal;
  background-color: #212121;
  padding: 5px 7px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  width: 100%;
  border: none;
`;
