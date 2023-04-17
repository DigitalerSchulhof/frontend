'use client';

import { useT } from '#/i18n/client';
import { TranslationsWithStringTypeAndNoVariables } from '#/i18n/translations';
import { Input, InputProps } from '#/ui/Input';
import { Table } from '#/ui/Table';
import React, { forwardRef, useId } from 'react';
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

export type FormRowProps = InputProps & {
  label: TranslationsWithStringTypeAndNoVariables;
};

export const FormRow = forwardRef<HTMLInputElement, FormRowProps>(
  function FormRow({ label, ...props }, ref) {
    const id = useId();
    const { t } = useT();

    return (
      <Table.Row>
        <Table.Header>
          <Label htmlFor={id}>{t(label)}</Label>
        </Table.Header>
        <Table.Cell>
          <Input id={id} {...props} ref={ref} />
        </Table.Cell>
      </Table.Row>
    );
  }
);

export const Label = styled.label`
  line-height: inherit;
`;
