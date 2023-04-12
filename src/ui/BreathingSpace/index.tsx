'use client';

import { styled } from 'styled-components';

export const BreathingSpace = styled.div`
  margin-top: 7px;
  margin-bottom: 7px;

  &:first-child {
    margin-top: 0;
  }
  &:last-child {
    margin-bottom: 0;
  }
`;
