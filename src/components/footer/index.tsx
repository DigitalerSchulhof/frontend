'use client';

import { BreathingSpace } from '#/ui/BreathingSpace';
import { Col } from '#/ui/Col';
import { styled } from 'styled-components';
import { Credits } from './credits';
import { Links } from './links';

export const Footer = () => {
  return (
    <FooterWrapper>
      <Col w='12'>
        <Links />
        <BreathingSpace />
        <Credits />
      </Col>
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
