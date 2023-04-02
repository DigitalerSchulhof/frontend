'use client';

import { useT } from '#/i18n/client';
import { TranslationsWithStringTypeAndNoVariables } from '#/i18n/translations';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import React from 'react';
import styled from 'styled-components';

export interface LinkProps extends Omit<NextLinkProps, 'href'> {
  children?: React.ReactNode;
  href: NextLinkProps['href'] | TranslationsWithStringTypeAndNoVariables[];
}

const UnstyledLink: React.FC<LinkProps> = ({ href, ...props }) => {
  const { t } = useT();

  const hrefString = Array.isArray(href) ? `/${href.map(t).join('/')}` : href;

  return <NextLink href={hrefString} {...props} />;
};

export const Link = styled(UnstyledLink)`
  color: ${({ theme }) => theme.colors.textLink};
`;
