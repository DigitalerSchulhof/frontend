'use client';

import styled from 'styled-components';

const StyledList = styled.table`
  width: 100%;
  margin: 10px 0;
  border-collapse: collapse;

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const List = ({ children }: { children: React.ReactNode }) => {
  return <StyledList>{children}</StyledList>;
};

List.Head = styled.thead``;

List.Body = styled.tbody``;

List.Row = styled.tr`
  border: 1px solid #424242;
  border-width: 1px 0;
`;

List.Header = styled.th`
  text-align: left;
  line-height: 1.5em;
  padding: 5px 7px;
  font-weight: bold;
`;

List.Cell = styled.td`
  text-align: left;
  padding: 5px 7px;
  line-height: 1.5em;
`;
