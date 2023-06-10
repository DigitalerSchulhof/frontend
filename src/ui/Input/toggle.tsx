'use client';

import {
  ChangeEventHandler,
  InputHTMLAttributes,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import { styled } from 'styled-components';

export type ToggleProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange' | 'defaultValue'
> & {
  onChange?: (value: boolean) => void;
  defaultValue?: boolean;
};

export const Toggle = forwardRef(function Toggle(
  { onChange, defaultValue, ...props }: ToggleProps,
  ref: React.Ref<{ value: boolean }>
) {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(
    ref,
    () => ({
      get value() {
        return inputRef.current!.checked;
      },
    }),
    []
  );

  return (
    <StyledToggle
      type='checkbox'
      ref={inputRef}
      onChange={useCallback<ChangeEventHandler<HTMLInputElement>>(
        (event) => {
          onChange?.(event.target.checked);
        },
        [onChange]
      )}
      defaultChecked={defaultValue}
      {...props}
    />
  );
});

export const StyledToggle = styled.input`
  appearance: none;
  margin: 0;
  position: relative;
  cursor: pointer;

  display: block;

  width: 42px;
  height: 22px;
  border-radius: 11px;
  background-color: ${({ theme }) => theme.accents.error.regular.background};
  border: 1px solid #212121;

  transition: background-color 0.2s ease-in-out;
  will-change: background-color;

  &::after {
    content: '';

    display: block;
    position: absolute;
    left: 0;

    width: 20px;
    height: 20px;
    border-radius: 10px;
    background-color: #212121;

    transition: left 0.2s ease-in-out;
    will-change: left;
  }

  &:checked {
    background-color: ${({ theme }) =>
      theme.accents.success.regular.background};

    &::after {
      left: 20px;
    }
  }
`;
