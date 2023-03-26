'use client';

import React, { forwardRef, useId } from 'react';
import styled from 'styled-components';
import { Input } from '#/ui/Input';
import { Table } from '#/ui/Table';
import { useTranslations } from '#/i18n';

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
    const { tIfCurly } = useTranslations();

    return (
      <Table.Row>
        <Table.Header>
          <Label htmlFor={id}>{tIfCurly(label)}</Label>
        </Table.Header>
        <Table.Cell>
          <Input ref={ref} id={id} {...props} />
        </Table.Cell>
      </Table.Row>
    );
  }
);

const Label = styled.label`
  line-height: inherit;
`;
