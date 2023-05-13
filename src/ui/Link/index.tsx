'use client';

import { useT } from '#/i18n';
import { TranslationsWithStringTypeAndNoVariables } from '#/i18n/translations';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import React from 'react';
import { styled } from 'styled-components';

export interface LinkProps extends Omit<NextLinkProps, 'href'> {
  children?: React.ReactNode;
  /**
   * @default false
   */
  external?: boolean;
  href: NextLinkProps['href'] | TranslationsWithStringTypeAndNoVariables[];
}

const UnstyledLink = ({ href, external, ...props }: LinkProps) => {
  const { t } = useT();

  const hrefString = Array.isArray(href) ? `/${href.map(t).join('/')}` : href;

  const externalProps = external
    ? {
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : {};

  return <NextLink href={hrefString} {...externalProps} {...props} />;
};

export const Link = styled(UnstyledLink)`
  color: ${({ theme }) => theme.colors.textLink};
  transition: 500ms ease-in-out;
`;
