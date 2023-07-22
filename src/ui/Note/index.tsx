'use client';

import { T } from '#/i18n';
import type { TranslationsWithStringTypeAndNoVariables } from '#/i18n/translations';
import { css, styled } from 'styled-components';
import type { Variant } from '../variants';

export interface NoteProps {
  variant?: Variant;
  t?: TranslationsWithStringTypeAndNoVariables;
  children?: React.ReactNode;
}

export const Note = ({ variant = 'default', t, ...props }: NoteProps) => {
  if (t) {
    props.children = <T t={t} />;
  }

  return <StyledNote $variant={variant} {...props} />;
};

export const StyledNote = styled.div<{
  $variant: Variant;
}>(
  ({ theme, $variant }) => css`
    color: ${{
      success: theme.accents.success.regular.background,
      warning: theme.accents.warning.regular.background,
      error: theme.accents.error.regular.background,
      information: theme.accents.information.regular.background,
      default: theme.colors.textMuted,
    }[$variant]};

    margin: 7px 0;
    font-size: 70%;
  `
);
