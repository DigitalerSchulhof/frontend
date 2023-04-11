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

const BodyWrapperInner = styled.main`
  margin: 0 auto;
  max-width: 1000px;
  padding: ${({ theme }) => theme.padding.medium} 0;
  width: 100%;

  display: grid;
  grid-template-columns: repeat(12, 1fr);
`;
