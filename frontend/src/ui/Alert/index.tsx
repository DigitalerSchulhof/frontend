import styled, { css } from 'styled-components';
import { Variant } from '../utils';

export interface AlertProps {
  variant: Variant;
}

export const Alert = styled.div<AlertProps>(
  ({ theme, variant = 'default' }) => css`
    margin: 10px 0;
    text-align: left;
    padding: 10px;
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
