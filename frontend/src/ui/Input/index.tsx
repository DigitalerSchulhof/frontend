'use client';

import styled, { css } from 'styled-components';

export const baseInputStyles = css`
  font-weight: normal;
  background-color: #212121;
  padding: 5px 7px;
  border-radius: 3px;
  width: 100%;
  border: none;
`;

export const Input = styled.input`
  ${baseInputStyles}
`;
