'use client';

import { Icon } from '../Icon';
import React from 'react';
import { Link } from '#/ui/Link';
import {
  ExecutionContext,
  IStyledComponent,
  css,
  styled,
} from 'styled-components';
import { Variant } from '../variants';
import { TranslationsWithStringTypeAndNoVariables } from '#/i18n/translations';
import { T } from '#/i18n';

export type BaseButtonProps = {
  variant?: Variant;
};

export const ButtonStyles = ({
  theme,
  variant = Variant.Default,
}: BaseButtonProps & ExecutionContext) => css`
  border: 1px solid transparent;
  border-radius: ${theme.borderRadius.medium};
  padding: 3px 7px;
  line-height: 1.5em;
  text-align: center;
  cursor: pointer;
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

const noForwardProps = new Set(['variant']);

export const StyledButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !noForwardProps.has(prop),
})<BaseButtonProps>(ButtonStyles);

export const StyledLink = styled(Link).withConfig({
  shouldForwardProp: (prop) => !noForwardProps.has(prop),
})<BaseButtonProps>`
  ${(props) => ButtonStyles(props)}

  display: inline-block;
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PropsFrom<T> = T extends IStyledComponent<any, any, infer P> ? P : never;

export const Button = ({
  t,
  ...props
}: (PropsFrom<typeof StyledButton> | PropsFrom<typeof StyledLink>) & {
  t?: TranslationsWithStringTypeAndNoVariables;
}) => {
  if (t) {
    props.children = <T t={t} />;
  }

  return 'href' in props ? (
    <StyledLink {...props} />
  ) : (
    <StyledButton {...props} />
  );
};

export type IconButtonProps = React.ComponentProps<typeof Button> & {
  icon: React.ReactNode;
};

const UnstyledIconButton = ({ icon, ...props }: IconButtonProps) => {
  return <Button {...props}>{icon}</Button>;
};

export const IconButton = styled(UnstyledIconButton)`
  padding: 1px;

  & > ${Icon} {
    margin: 0;
  }
`;

export const ButtonGroup = styled.section`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  gap: 5px;

  margin: 10px 0;
`;
