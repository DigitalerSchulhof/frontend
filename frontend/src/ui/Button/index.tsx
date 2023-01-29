import React, { HTMLAttributes } from 'react';
import styled, { css } from 'styled-components';
import { Variant } from '../utils';

export interface ButtonProps {
  variant?: Variant;
}

export const Button = styled.button<ButtonProps>(
  ({ theme, variant = 'default' }) => css`
    border: 1px solid transparent;
    border-radius: 3px;
    padding: 3px 7px;
    margin-bottom: 2px;
    line-height: 1.5em;
    text-align: center;
    cursor: pointer;
    margin: 0 2px;
    transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;

    background-color: ${theme.accents[variant].regular.background};
    color: ${theme.accents[variant].regular.text};

    &:hover {
      background-color: ${theme.accents[variant].hover.background};
      color: ${theme.accents[variant].hover.text};
    }

    &:first-child {
      margin-left: 0px;
    }

    &:last-child {
      margin-right: 0px;
    }
  `
);

export interface IconButtonProps
  extends ButtonProps,
    HTMLAttributes<HTMLButtonElement> {}

export const IconButton: React.FC<IconButtonProps> = ({ ...props }) => {
  return <Button {...props}></Button>;
};
