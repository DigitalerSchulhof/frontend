import React, { forwardRef, useId } from 'react';
import styled from 'styled-components';
import { Input } from '../Input';
import { Td, Th, Tr } from '../Table';

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

export interface FormRowProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const FormRow = forwardRef<HTMLInputElement, FormRowProps>(
  function FormRow({ label, ...props }, ref) {
    const id = useId();

    return (
      <Tr>
        <Th>
          <Label htmlFor={id}>{label}</Label>
        </Th>
        <Td>
          <Input ref={ref} id={id} {...props} />
        </Td>
      </Tr>
    );
  }
);

const Label = styled.label`
  line-height: inherit;
`;
