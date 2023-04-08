'use client';

import { styled } from 'styled-components';
import { Credits } from './credits';
import { Links } from './links';

export const Footer = () => {
  return (
    <FooterWrapper>
      <Links />
      <Credits />
    </FooterWrapper>
  );
};

const FooterWrapper = styled.footer`
  margin: 0 auto;
  max-width: 1000px;
  padding: ${({ theme }) => theme.padding.medium} 0;
  width: 100%;

  display: grid;
  grid-template-columns: repeat(12, 1fr);
`;
