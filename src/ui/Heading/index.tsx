'use client';

import { T } from '#/i18n';
import type { TranslationsWithStringTypeAndNoVariables } from '#/i18n/translations';
import { StyledBreadcrumbs } from '#/ui/Breadcrumbs/client';
import { css, styled } from 'styled-components';

export type HeadingSize = '1' | '2' | '3' | '4';

export interface HeadingProps {
  size: HeadingSize;
  t?: TranslationsWithStringTypeAndNoVariables;
  children?: React.ReactNode;
}

export const Heading = ({ size, t, ...props }: HeadingProps) => {
  if (t) {
    props.children = <T t={t} />;
  }

  return <StyledHeading $size={size} {...props} />;
};

export const StyledHeading = styled.h1.attrs<{
  $size: HeadingSize;
}>(({ $size }) => ({
  as: `h${$size}`,
}))<{
  $size: HeadingSize;
}>`
  ${({ $size }) => {
    const h = `h${$size}` as const;

    return css`
      font-size: ${{ h1: '170%', h2: '140%', h3: '120%', h4: '100%' }[h]};
      font-weight: bold;

      margin-top: ${{
        h1: '40px',
        h2: '30px',
        h3: '30px',
        h4: '30px',
      }[h]};

      margin-bottom: ${{
        h1: '15px',
        h2: '10px',
        h3: '10px',
        h4: '7px',
      }[h]};

      &:first-child {
        margin-top: 0;
      }

      &:last-child {
        margin-bottom: 0;
      }

      ${StyledBreadcrumbs} + & {
        margin-top: 10px;
      }
    `;
  }}
`;
