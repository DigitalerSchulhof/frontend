import { StyledButton, StyledLink } from '../Button';
import { Icon } from '../Icon';
import styled, { css } from 'styled-components';

const cellProps = css`
  border: 1px solid #424242;
  border-left: 0;
  border-right: 0;

  padding: 3px;
  text-align: left;
  vertical-align: middle;

  & > ${Icon} {
    margin: 2px;
  }

  & > ${StyledButton}, & > ${StyledLink} {
    margin-top: 0;
    margin-bottom: 0;
  }
`;

export const TableList = styled.table`
  width: 100%;

  border-collapse: collapse;
`;

export const TableListHead = styled.thead``;

export const TableListRow = styled.tr``;

export const TableListHeader = styled.th`
  font-weight: bold;
  line-height: 1.5em;
  height: 28px;

  ${cellProps}
`;

export const TableListIconHeader = styled(TableListHeader)<{
  /**
   * Maximum number of icons to display
   *
   * @default 1
   */
  nr?: number;
}>(
  ({ nr = 1 }) => css`
    width: ${nr * 24 - 4 + /* padding */ 2 * 3}px;
  `
);

export const TableListBody = styled.tbody``;

export const TableListCell = styled.td`
  height: 26px;

  ${cellProps}
`;
