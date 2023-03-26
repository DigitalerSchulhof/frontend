'use client';

import styled from 'styled-components';

export type ColNr =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12';

export interface ColProps {
  w: ColNr;
}

export const Col = styled.div<ColProps>`
  padding: 10px;
  grid-column: span ${(props) => props.w};
`;

export const Break = styled.div`
  flex-basis: 100%;
  height: 0;
`;
