'use client';

import { StyledIcon } from '../Icon';
import React from 'react';
import { Link } from '#/ui/Link';
import { ExecutionContext, css, styled } from 'styled-components';
import { Variant } from '../variants';
import { TranslationsWithStringTypeAndNoVariables } from '#/i18n/translations';
import { T, useT } from '#/i18n';

export type BaseButtonProps = {
  $variant?: Variant;
};

export const ButtonStyles = ({
  theme,
  $variant = 'default',
}: BaseButtonProps & ExecutionContext) => css`
  border: 1px solid transparent;
  border-radius: ${theme.borderRadius.medium};
  padding: 3px 7px;
  line-height: 1.5em;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;

  background-color: ${theme.accents[$variant].regular.background};
  color: ${theme.accents[$variant].regular.text};

  &:hover {
    background-color: ${theme.accents[$variant].hover.background};
    color: ${theme.accents[$variant].hover.text};
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

export const Button = ({
  t,
  variant,
  ...props
}: Omit<React.ComponentProps<typeof StyledButton>, 'variant'> & {
  t?: TranslationsWithStringTypeAndNoVariables;
  href?: React.ComponentProps<typeof Link>['href'];
  variant?: Variant;
}) => {
  if (t) {
    props.children = <T t={t} />;
  }

  const { href } = props;

  return href ? (
    // @ts-expect-error -- No way we can type this correctly
    <StyledLink $variant={variant} {...props} href={href} />
  ) : (
    <StyledButton $variant={variant} {...props} />
  );
};

export type IconButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  'title' | 'children'
> & {
  title: TranslationsWithStringTypeAndNoVariables;
  icon: React.ReactNode;
};

const UnstyledIconButton = ({ icon, title, ...props }: IconButtonProps) => {
  const { t } = useT();
  const translatedTitle = t(title);

  return (
    <Button title={translatedTitle} {...props}>
      {icon}
    </Button>
  );
};

export const IconButton = styled(UnstyledIconButton)`
  padding: 1px;

  & > ${StyledIcon} {
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
