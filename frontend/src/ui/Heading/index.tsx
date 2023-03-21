'use client';

import styled, { css } from 'styled-components';
// import { StyledBreadcrumbs } from '../Breadcrumbs';

export type HeadingSize = '1' | '2' | '3' | '4';

export interface HeadingProps {
  size: HeadingSize;
}

const noForwardProps = new Set(['size']);

export const Heading = styled.h1
  .withConfig({
    shouldForwardProp: (prop) => !noForwardProps.has(prop),
  })
  // @ts-expect-error
  .attrs<HeadingProps>(({ size }) => ({
    as: `h${size}`,
  }))<HeadingProps>`
  ${({ size }) => {
    const h = `h${size}` as const;

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
    `;
  }}
`;
