'use client';

import {
  ClassAttributes,
  InputHTMLAttributes,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import { styled } from 'styled-components';

export { Toggle } from './toggle';

export type InputProps = ClassAttributes<HTMLInputElement> &
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'defaultValue' | 'defaultChecked'
  >;

export type TextInputProps = InputProps & {
  defaultValue?: string;
  /**
   * @default 'text'
   */
  type?: 'text' | 'password';
};

export const TextInput = forwardRef<{ value: string }, TextInputProps>(
  function TextInput({ type = 'text', ...props }, ref) {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      get value() {
        return inputRef.current!.value;
      },
    }));

    return <StyledInput ref={inputRef} type={type} {...props} />;
  }
);

export type NumberInputProps = InputProps & {
  defaultValue?: number;
};

export const NumberInput = forwardRef<{ value: number }, NumberInputProps>(
  function NumberInput({ ...props }, ref) {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      get value() {
        return inputRef.current!.valueAsNumber;
      },
    }));

    return <StyledInput ref={inputRef} type='number' {...props} />;
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
