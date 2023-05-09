'use client';

import { StyledButton } from '#/ui/Button';
import { useToggle } from '#/utils/client';
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
  const [visible, setVisible, setInvisible] = useToggle(defaultVisible);

  return (
    <>
      {visible ? content : null}
      {visible ? (
        // Force a key change to force a re-render of the button
        // Else the button will only sort of change its colors when the cursor is moved and stuff is.. updated.. due to the transition?
        // The re-render will force the new color to be applied instantly
        <ToggleButton key='hide' onClick={setInvisible} mode='hide'>
          {hide}
        </ToggleButton>
      ) : (
        <ToggleButton key='show' onClick={setVisible} mode='show'>
          {show}
        </ToggleButton>
      )}
    </>
  );
};

const noForwardProps = new Set(['mode']);

const ToggleButton = styled(StyledButton).withConfig({
  shouldForwardProp: (prop) => !noForwardProps.has(prop),
})<{ mode: 'show' | 'hide' }>(
  ({ mode: $mode, theme }) => css`
    display: block;
    margin: 7px 0;

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
