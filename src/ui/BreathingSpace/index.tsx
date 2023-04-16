'use client';

import { styled } from 'styled-components';

export const BreathingSpace = styled.div`
  height: 1px;
  margin-top: 7px;
  margin-bottom: 7px;

  &:first-child {
    margin-top: 0;
  }
  &:last-child {
    margin-bottom: 0;
  }
`;
