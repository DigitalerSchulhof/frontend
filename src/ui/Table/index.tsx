'use client';

import styled from 'styled-components';
import { css } from 'styled-components';

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

Table.Row = styled.div`
  display: contents;
`;

const cellStyles = css`
  line-height: 1.5em;
  padding: 5px 7px;
  display: flex;
  align-items: center;
  justify-content: left;
`;

Table.Header = styled.div`
  ${cellStyles}
  font-weight: bold;
`;

Table.Cell = styled.div`
  ${cellStyles}
`;
