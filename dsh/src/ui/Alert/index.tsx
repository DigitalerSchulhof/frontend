'use client';

import styled, { css } from 'styled-components';
import { Variant } from '../variants';

export interface AlertProps {
  variant: Variant;
}

const noForwardProps = new Set(['variant']);

export const Alert = styled.div.withConfig({
  shouldForwardProp: (prop) => !noForwardProps.has(prop),
})<AlertProps>(
  ({ theme, variant = Variant.Default }) => css`
    margin: 10px 0;
    text-align: left;
    padding: ${theme.padding.medium};
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
    min-height: 42px;
    width: 100%;

    border-left: 4px solid ${theme.accents[variant].hover.background};
    background-color: ${theme.accents[variant].regular.background};
    color: ${theme.accents[variant].regular.text};

    &:first-child {
      margin-top: 0;
    }
    &:last-child {
      margin-bottom: 0;
    }
  `
);
