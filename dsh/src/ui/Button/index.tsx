'use client';

import { Icon } from '../Icon';
import React, { HTMLAttributes } from 'react';
import { Link } from '#/ui/Link';
import styled, {
  ExecutionContext,
  IStyledComponent,
  css,
} from 'styled-components';
import { Variant } from '../variants';

export type BaseButtonProps = {
  variant?: Variant;
};

const ButtonStyles = ({
  theme,
  variant = Variant.Default,
}: BaseButtonProps & ExecutionContext) => css`
  border: 1px solid transparent;
  border-radius: ${theme.borderRadius.medium};
  padding: 3px 7px;
  margin-bottom: 2px;
  line-height: 1.5em;
  text-align: center;
  cursor: pointer;
  margin: 0 2px;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;

  background-color: ${theme.accents[variant].regular.background};
  color: ${theme.accents[variant].regular.text};

  &:hover {
    background-color: ${theme.accents[variant].hover.background};
    color: ${theme.accents[variant].hover.text};
  }

  &:first-child {
    margin-left: 0px;
  }

  &:last-child {
    margin-right: 0px;
  }
`;

export const StyledButton = styled.button<BaseButtonProps>(ButtonStyles);

export const StyledLink = styled(Link)<BaseButtonProps>`
  ${(props) => ButtonStyles(props)}

  display: inline-block;
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PropsFrom<T> = T extends IStyledComponent<any, any, infer P> ? P : never;

export const Button = (
  props: PropsFrom<typeof StyledButton> | PropsFrom<typeof StyledLink>
) => {
  return 'href' in props ? (
    <StyledLink {...props} />
  ) : (
    <StyledButton {...props} />
  );
};

export interface IconButtonProps
  extends BaseButtonProps,
    HTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
}

const UnstyledIconButton: React.FC<IconButtonProps> = ({ icon, ...props }) => {
  return <Button {...props}>{icon}</Button>;
};

export const IconButton = styled(UnstyledIconButton)`
  padding: 0;
  margin: 2px;

  & > ${Icon} {
    margin: 1px;
  }
`;
