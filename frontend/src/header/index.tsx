'use client';

import { css, styled } from 'styled-components';

export const Header = () => {
  return <HeaderWrapper></HeaderWrapper>;
};

const HeaderWrapper = styled.div(
  ({ theme }) => css`
    background-color: ${theme.backgroundColor};

    height: 82px;
    border-bottom: 1px solid #eaeaea;
  `
);
