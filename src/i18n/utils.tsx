import { Link } from '#/ui/Link';
import { FormatXMLElementFn } from 'intl-messageformat';
import React from 'react';

type LinkProps = React.ComponentProps<typeof Link>;

export function makeLink(
  href: LinkProps['href'],
  options: Omit<LinkProps, 'href'> = {}
): FormatXMLElementFn<string | JSX.Element, JSX.Element[]> {
  return (c) =>
    c.map((e) => (
      // eslint-disable-next-line react/jsx-key
      <Link href={href} {...options}>
        {e}
      </Link>
    ));
}
