import styled from 'styled-components';

export type ColNr = '1' | '2' | '3' | '4';

export interface ColProps {
  nr: ColNr;
}

export const Col = styled.div<ColProps>`
  padding: 10px;
  flex-basis: ${({ nr }) =>
    ({
      1: '100%',
      2: '50%',
      3: '33.333333%',
      4: '25%',
    }[nr])};
`;

export const Break = styled.div`
  flex-basis: 100%;
  height: 0;
`;
