import { Link, LinkProps } from '#/ui/Link';
import { FormatXMLElementFn } from 'intl-messageformat';

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
