import React from 'react';
import styled, { css } from 'styled-components';
import { StyledBreadcrumbs } from '../Breadcrumbs';

export type HeadingSize = '1' | '2' | '3' | '4';

export interface HeadingProps {
  size: HeadingSize;
}

export const Heading = styled.h1.attrs<HeadingProps>(({ size }) => ({
  as: `h${size}`,
}))<HeadingProps>`
  ${({ size }) => {
    const h = `h${size}` as const;

    return css`
      font-size: ${({ theme }) => theme.fontSizes[h]};
      font-weight: bold;

      margin-top: ${{
        h1: '40px',
        h2: '30px',
        h3: '30px',
        h4: '30px',
      }[h]};

      margin-bottom: 10px;

      &:first-child {
        margin-top: 0;
      }

      ${StyledBreadcrumbs} + & {
        margin-top: 10px;
      }

      &:last-child {
        margin-bottom: 0;
      }
    `;
  }}
`;
