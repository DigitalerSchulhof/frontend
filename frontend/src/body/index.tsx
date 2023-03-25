'use client';

import { css, styled } from 'styled-components';

export const Body = ({ children }: { children: React.ReactNode }) => {
  return (
    <BodyWrapperOuter>
      <BodyWrapperInner>{children}</BodyWrapperInner>
    </BodyWrapperOuter>
  );
};

const BodyWrapperOuter = styled.div(
  ({ theme }) => css`
    background-color: ${theme.backgroundColor};

    min-height: 500px;
  `
);

const BodyWrapperInner = styled.div`
  margin: 0 auto;
  max-width: 1000px;
  padding: 30px 10px;
  width: 100%;
`;
