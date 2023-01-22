import NextLink, { LinkProps } from 'next/link';
import styled from 'styled-components';

export const Link = styled(NextLink).attrs(({ href }) => ({
  // If given an array of strings, join them with slashes and prepend one
  href: Array.isArray(href) ? `/${href.join('/')}` : href,
}))<{ href: LinkProps['href'] | string[] }>`
  color: ${({ theme }) => theme.colors.textLink};
`;
