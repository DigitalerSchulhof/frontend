import { Link } from '#/ui/Link';
import type { FormatXMLElementFn } from 'intl-messageformat';
import React from 'react';

type LinkProps = React.ComponentProps<typeof Link>;

export function makeLink(
  href: LinkProps['href'],
  options: Omit<LinkProps, 'href'> = {}
): FormatXMLElementFn<string | JSX.Element, JSX.Element[]> {
  return (c) => {
    return c.map((e) => (
      // TODO: Do we need a key? Probably
      // eslint-disable-next-line react/jsx-key
      <Link href={href} {...options}>
        {e}
      </Link>
    ));
  };
}
