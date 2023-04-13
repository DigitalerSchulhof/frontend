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

const noForwardProps = new Set(['w']);

export const Col = styled.section.withConfig({
  shouldForwardProp: (prop) => !noForwardProps.has(prop),
})<ColProps>`
  padding: ${({ theme }) => theme.padding.medium};
  grid-column: span ${(props) => props.w};
`;

export const Break = styled.div`
  flex-basis: 100%;
  height: 0;
`;
