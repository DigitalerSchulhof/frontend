'use client';

import { T } from '#/i18n';
import type { TranslationsWithStringTypeAndNoVariables } from '#/i18n/translations';
import { StyledToggle } from '#/ui/Input/toggle';
import React from 'react';
import { css, styled } from 'styled-components';

const StyledTable = styled.div<{ $h?: number | string; $w?: number | string }>(
  ({ theme, $h, $w }) => {
    const w = typeof $w === 'number' ? `repeat(${$w}, 1fr)` : $w;
    const h = typeof $h === 'number' ? `repeat(${$h}, 1fr)` : $h;

    return css`
      display: grid;
      ${w &&
      css`
        grid-template-columns: ${w};
      `}
      ${h &&
      css`
        grid-template-rows: ${h};
      `}

      background-color: #424242;
      border-radius: ${theme.borderRadius.medium};
      width: 100%;
      margin: 10px 0;

      &:first-child {
        margin-top: 0;
      }

      &:last-child {
        margin-bottom: 0;
      }
    `;
  }
);

export type TableProps = {
  rows?: number | string;
  /**
   * @default '1fr 2fr'
   */
  columns?: number | string;
  children: React.ReactNode;
};

export const Table = ({
  rows: h,
  columns: w = '1fr 2fr',
  children,
}: TableProps) => {
  return (
    <StyledTable $h={h} $w={w}>
      {children}
    </StyledTable>
  );
};

export const TableRow = styled.div`
  display: contents;
`;

const cellStyles = css`
  line-height: 1.5em;
  padding: 5px 7px;
  display: flex;
  align-items: center;
  justify-content: left;
  gap: 5px;
`;

export type TableHeaderProps = React.ComponentProps<
  typeof StyledTableHeader
> & {
  children?: React.ReactNode;
  t?: TranslationsWithStringTypeAndNoVariables;
};

export const TableHeader = ({ children, t, ...props }: TableHeaderProps) => {
  if (t) {
    children = <T t={t} />;
  }

  return <StyledTableHeader {...props}>{children}</StyledTableHeader>;
};

export const StyledTableHeader = styled.div`
  ${cellStyles}
  font-weight: bold;
`;

export const TableCell = styled.div`
  ${cellStyles}

  & > ${StyledToggle}:first-child:last-child {
    margin-left: auto;
  }
`;
