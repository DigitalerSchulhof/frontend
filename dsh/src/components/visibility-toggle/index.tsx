'use client';

import { BreathingSpace } from '#/ui/BreathingSpace';
import { StyledButton } from '#/ui/Button';
import { useState } from 'react';
import { css, styled } from 'styled-components';

export const VisibilityToggle = ({
  show,
  hide,
  content,
  defaultVisible = false,
}: {
  show: React.ReactNode;
  hide: React.ReactNode;
  content: React.ReactNode;
  defaultVisible?: boolean;
}) => {
  const [visible, setVisible] = useState(defaultVisible);

  return (
    <>
      {visible ? content : null}
      <BreathingSpace />
      {visible ? (
        // Force a key change to force a re-render of the button
        // Else the button will only sort of change its colors when the cursor is moved and stuff is.. updated.. due to the transition?
        // The re-render will force the new color to be applied instantly
        <ToggleButton key='hide' onClick={() => setVisible(false)} $mode='hide'>
          {hide}
        </ToggleButton>
      ) : (
        <ToggleButton key='show' onClick={() => setVisible(true)} $mode='show'>
          {show}
        </ToggleButton>
      )}
      <BreathingSpace />
    </>
  );
};

const ToggleButton = styled(StyledButton)<{ $mode: 'show' | 'hide' }>(
  ({ $mode, theme }) => css`
    background-color: ${theme.accents[$mode === 'show' ? 'default' : 'success']
      .regular.background};
    color: ${theme.accents[$mode === 'show' ? 'default' : 'success'].regular
      .text};

    &:hover {
      background-color: ${theme.accents[$mode === 'show' ? 'success' : 'error']
        .hover.background};
      color: ${theme.accents[$mode === 'show' ? 'success' : 'error'].hover
        .text};
    }
  `
);
