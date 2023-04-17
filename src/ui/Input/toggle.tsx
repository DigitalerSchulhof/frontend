'use client';

import { styled } from 'styled-components';

export type ToggleProps = {
  defaultChecked?: boolean;
};

export const Toggle = ({ props }: ToggleProps) => {
  return <StyledToggle type='checkbox' />;
};

export const StyledToggle = styled.input`
  appearance: none;
  margin: 0;
  position: relative;
  width: 40px;
  height: 20px;
  cursor: pointer;

  &::before {
    content: '';

    display: block;
    position: absolute;

    width: 40px;
    height: 20px;
    border-radius: 11px;
    background-color: ${({ theme }) => theme.accents.error.regular.background};
    border: 1px solid #212121;
    margin-top: -0.4px;
    margin-left: -0.4px;

    transition: background-color 0.2s ease-in-out;
    will-change: background-color;
  }

  &::after {
    content: '';

    display: block;
    position: absolute;
    top: 0.4px;
    left: 0.4px;

    width: 20px;
    height: 20px;
    border-radius: 10px;
    background-color: #212121;

    transition: left 0.2s ease-in-out;
    will-change: left;
  }

  &:checked {
    &::before {
      background-color: ${({ theme }) =>
        theme.accents.success.regular.background};
    }

    &::after {
      left: 20.6px;
    }
  }
`;
