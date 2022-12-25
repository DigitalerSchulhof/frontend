import React from 'react';
import styled, { css } from 'styled-components';

export interface ButtonProps {
  variant?: 'success' | 'warning' | 'error' | 'default';
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
    transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;

    background-color: ${theme.accents[variant].regular.background};

    color: ${theme.accents[variant].regular.text};

    &:hover {
      background-color: ${theme.accents[variant].hover.background};

      color: ${theme.accents[variant].hover.text};
    }

    &:not(:first-child) {
      margin-left: 2px;
    }

    &:not(:last-child) {
      margin-right: 2px;
    }
  `
);
