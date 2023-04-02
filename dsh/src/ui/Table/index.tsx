'use client';

import styled from 'styled-components';

const StyledTable = styled.table`
  background-color: #424242;
  border-radius: 2px;
  width: 100%;
`;

export const Table = ({ children }: { children: React.ReactNode }) => {
  return <StyledTable>{children}</StyledTable>;
};

Table.Head = styled.thead``;

Table.Body = styled.tbody``;

Table.Row = styled.tr``;

Table.Header = styled.th`
  text-align: left;
  line-height: 1.5em;
  padding: 5px 7px;
  font-weight: bold;
`;

Table.Cell = styled.td`
  text-align: left;
  padding: 5px 7px;
  line-height: 1.5em;
`;
