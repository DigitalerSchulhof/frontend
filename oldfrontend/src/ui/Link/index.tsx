import { TranslationAST, useT } from '@i18n';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import React from 'react';
import styled from 'styled-components';

export interface LinkProps extends Omit<NextLinkProps, 'href'> {
  children?: React.ReactNode;
  href: NextLinkProps['href'] | (string | TranslationAST<string>)[];
}

const UnstyledLink: React.FC<LinkProps> = ({ href, ...props }) => {
  const t = useT();

  const hrefString = Array.isArray(href)
    ? `/${href
        .map((item) => (typeof item === 'string' ? item : t(item)))
        .join('/')}`
    : href;

  return <NextLink href={hrefString} {...props} />;
};

export const Link = styled(UnstyledLink)`
  color: ${({ theme }) => theme.colors.textLink};
`;
