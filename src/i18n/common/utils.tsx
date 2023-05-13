import { TFunction } from '#/i18n/common/function';
import { Link, LinkProps } from '#/ui/Link';
import { FormatXMLElementFn } from 'intl-messageformat';

export type TContext = {
  t: TFunction;
};

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
