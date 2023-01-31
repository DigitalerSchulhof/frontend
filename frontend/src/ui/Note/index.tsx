import { Variant } from '@UI/utils';
import styled, { css } from 'styled-components';

export interface NoteProps {
  variant?: Variant;
}

export const Note = styled.div<NoteProps>(
  ({ theme, variant = 'default' }) => css`
    color: ${{
      success: theme.accents.success.regular.background,
      warning: theme.accents.warning.regular.background,
      error: theme.accents.error.regular.background,
      default: theme.colors.textMuted,
    }[variant]};

    margin: 7px 0;
    font-size: 70%;
  `
);
