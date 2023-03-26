'use client';

import { useTranslations } from '#/i18n';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import React from 'react';
import styled from 'styled-components';

export interface LinkProps extends Omit<NextLinkProps, 'href'> {
  children?: React.ReactNode;
  href: NextLinkProps['href'] | string[];
}

const UnstyledLink: React.FC<LinkProps> = ({ href, ...props }) => {
  const { tIfCurly } = useTranslations();

  const hrefString = Array.isArray(href)
    ? `/${href.map(tIfCurly).join('/')}`
    : href;

  return <NextLink href={hrefString} {...props} />;
};

export const Link = styled(UnstyledLink)`
  color: ${({ theme }) => theme.colors.textLink};
`;
