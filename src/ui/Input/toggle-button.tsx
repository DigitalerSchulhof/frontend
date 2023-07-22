'use client';

import { T } from '#/i18n';
import type { TranslationsWithStringTypeAndNoVariables } from '#/i18n/translations';
import { StyledButton } from '#/ui/Button';
import { useToggle } from '#/utils/client';
import { forwardRef, useCallback, useImperativeHandle } from 'react';
import { css, styled } from 'styled-components';

export type ToggleButtonProps = Omit<
  React.ComponentProps<typeof StyledToggleButton>,
  'type' | 'onChange' | 'defaultValue' | '$value'
> & {
  onChange?: (value: boolean) => void;
  defaultValue?: boolean;
  t: TranslationsWithStringTypeAndNoVariables;
};

export const ToggleButton = forwardRef(function ToggleButton(
  { onChange, defaultValue, t, ...props }: ToggleButtonProps,
  ref: React.Ref<{ value: boolean }>
) {
  const [enabled, , , toggle] = useToggle(defaultValue);

  useImperativeHandle(
    ref,
    () => ({
      get value() {
        return enabled;
      },
    }),
    [enabled]
  );

  return (
    <StyledToggleButton
      onClick={useCallback(() => {
        onChange?.(!enabled);
        toggle();
      }, [enabled, onChange, toggle])}
      $value={enabled}
      {...props}
    >
      <T t={t} />
    </StyledToggleButton>
  );
});

export const StyledToggleButton = styled(StyledButton)<{ $value: boolean }>(
  ({ theme, $value }) => css`
    background-color: ${theme.accents[$value ? 'success' : 'default'].regular
      .background};
    color: ${theme.accents[$value ? 'success' : 'default'].regular.text};
    border: 1px solid rgb(33, 33, 33);

    &:hover {
      background-color: ${theme.accents[$value ? 'error' : 'success'].hover
        .background};
      color: ${theme.accents[$value ? 'error' : 'success'].hover.text};
    }
  `
);
