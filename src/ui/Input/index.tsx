'use client';

import { ClassAttributes, InputHTMLAttributes, forwardRef } from 'react';
import { styled } from 'styled-components';

export type InputProps = ClassAttributes<HTMLInputElement> &
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'defaultValue' | 'defaultChecked'
  > &
  (
    | {
        type?: 'text' | 'password';
        defaultValue?: string;
      }
    | {
        type?: 'number';
        defaultValue?: number;
      }
    | {
        type: 'checkbox';
        defaultValue?: boolean;
      }
  );

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { type, defaultValue, ...props },
  ref
) {
  if (type === 'checkbox') {
    return (
      <StyledInput
        ref={ref}
        {...props}
        type='checkbox'
        defaultChecked={defaultValue}
      />
    );
  }

  return (
    <StyledInput ref={ref} {...props} type={type} defaultValue={defaultValue} />
  );
});

export const StyledInput = styled.input`
  font-weight: normal;
  background-color: #212121;
  padding: 5px 7px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  width: 100%;
  border: none;
`;
