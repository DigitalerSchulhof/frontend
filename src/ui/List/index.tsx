'use client';

import { T } from '#/i18n';
import { TranslationsWithStringTypeAndNoVariables } from '#/i18n/translations';
import React from 'react';
import { keyframes, styled } from 'styled-components';
import { css } from 'styled-components';

const StyledList = styled.div<{ $h?: number | string; $w?: number | string }>(
  ({ $h, $w }) => {
    const w = typeof $w === 'number' ? `repeat(${$w}, 1fr)` : $w;
    const h = typeof $h === 'number' ? `repeat(${$h}, 1fr)` : $h;

    return css`
      display: grid;
      ${w &&
      css`
        grid-template-columns: ${w};
      `}
      ${h &&
      css`
        grid-template-rows: ${h};
      `}

      width: 100%;
      margin: 10px 0;

      &:first-child {
        margin-top: 0;
      }

      &:last-child {
        margin-bottom: 0;
      }
    `;
  }
);

export type ListProps = {
  rows?: number | string;
  /**
   * @default '1fr 2fr'
   */
  columns?: number | string;
  children: React.ReactNode;
  /**
   * Note that if a loading bar is present, rows must be a number.
   */
  isLoading?: boolean;
};

export const List = ({
  rows: h,
  columns: w = '1fr 2fr',
  children,
  isLoading,
}: ListProps) => {
  const renderLoadingBar = isLoading !== undefined;

  let loadingBarHOrH;
  if (renderLoadingBar) {
    if (typeof h !== 'number') {
      throw new Error('If a loading bar is present, rows must be specified.');
    }

    loadingBarHOrH = `3px repeat(${h}, 1fr)`;
  } else {
    loadingBarHOrH = h;
  }

  return (
    <StyledList $h={loadingBarHOrH} $w={w}>
      {renderLoadingBar ? <LoadingBar $isLoading={isLoading} /> : null}
      {children}
    </StyledList>
  );
};

const loadingBarAnimationA = keyframes`
  0%   { left: 0;    width: 0;   }
  10%  { left: 0;    width: 20%; }
  20%  { left: 20%;  width: 20%; }
  30%  { left: 40%;  width: 20%; }
  40%  { left: 60%;  width: 20%; }
  50%  { left: 80%;  width: 20%; }
  60%  { left: 100%; width: 0;   }
`;

const loadingBarAnimationB = keyframes`
  0%   { left: 80%;  width: 20%; }
  10%  { left: 100%; width: 0;   }
  50%  { left: 0;    width: 0;   }
  60%  { left: 0;    width: 20%; }
  70%  { left: 20%;  width: 20%; }
  80%  { left: 40%;  width: 20%; }
  90%  { left: 60%;  width: 20%; }
  100% { left: 80%;  width: 20%; }
`;

const LoadingBar = styled.div<{ $isLoading?: boolean }>(
  ({ $isLoading, theme }) => css`
    grid-column: 1 / -1;
    grid-row: 1 / -1;
    visibility: ${$isLoading ? '' : 'hidden'};
    position: relative;
    &::before {
      content: '';
      display: block;
      height: 2px;
      background-color: ${theme.accents.information.regular.background};
      position: absolute;
      ${$isLoading &&
      css`
        animation: ${loadingBarAnimationA} 1s infinite linear;
      `}
    }
    &::after {
      content: '';
      display: block;
      height: 2px;
      background-color: ${theme.accents.success.regular.background};
      position: absolute;
      ${$isLoading &&
      css`
        animation: ${loadingBarAnimationB} 1s infinite linear;
      `}
    }
  `
);

const cellStyles = css`
  line-height: 1.5em;
  padding: 5px 7px;
  display: flex;
  align-items: center;
  justify-content: left;
  gap: 5px;
  border: 1px solid #424242;
  border-width: 1px 0 0 0;
`;

export const StyledListHeader = styled.div`
  ${cellStyles}
  font-weight: bold;
`;

export const ListCell = styled.div`
  ${cellStyles}
`;

export const ListRow = styled.div`
  display: contents;

  &:last-child {
    ${ListCell} {
      border-bottom-width: 1px;
    }
    ${StyledListHeader} {
      border-bottom-width: 1px;
    }
  }
`;

export type ListHeaderProps = React.ComponentProps<typeof StyledListHeader> & {
  children?: React.ReactNode;
  t?: TranslationsWithStringTypeAndNoVariables;
};

export const ListHeader = ({ children, t, ...props }: ListHeaderProps) => {
  if (t) {
    children = <T t={t} />;
  }

  return <StyledListHeader {...props}>{children}</StyledListHeader>;
};
