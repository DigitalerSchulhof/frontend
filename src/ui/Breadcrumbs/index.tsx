// Both Server and Client Component

import { useT } from '#/i18n';
import { TranslationsWithStringTypeAndNoVariables } from '#/i18n/translations';
import {
  StyledBreadcrumbItem,
  StyledBreadcrumbs,
} from '#/ui/Breadcrumbs/client';
import { LinkProps } from '#/ui/Link';
import { Fragment } from 'react';

/**
 * For a segment `S`, the title of the breadcrumb is, if available, the translation `S.title`, otherwise the translation `S`.
 *
 * @example
 * ```ts
 * const breadcrumbs = [
 *   'paths.schulhof',
 *   'paths.schulhof.administration',
 * ];
 *
 * // Yields the following breadcrumbs:
 * // Schulhof   -> /Schulhof
 * // Verwaltung -> /Schulhof/Verwaltung
 * ```
 *
 * @example
 * ```ts
 * const breadcrumbs = [
 *   'paths.schulhof',
 *   'paths.schulhof.administration',
 *   {
 *     segment: 'paths.schulhof.administration.persons',
 *     href: [
 *       'paths.schulhof',
 *       'paths.schulhof.administration',
 *     ],
 *   },
 *   'paths.schulhof.administration.persons.persons',
 * ];
 *
 * // Yields the following breadcrumbs:
 * // Schulhof             -> /Schulhof
 * // Verwaltung           -> /Schulhof/Verwaltung
 * // Personen und Gruppen -> /Schulhof/Verwaltung
 * // Personen             -> /Schulhof/Verwaltung/Personen_und_Gruppen/Personen
 * ```
 */
export type BreadcrumbItem =
  | Exclude<TranslationsWithStringTypeAndNoVariables, `{${string}}`>
  | {
      /**
       * The title of the breadcrumb item
       */
      title?: TranslationsWithStringTypeAndNoVariables;
      /**
       * The value to be used for the current item in constructing the href of the succeeding items
       */
      segment: TranslationsWithStringTypeAndNoVariables;
      /**
       * Override the href of the breadcrumb item (direct click)
       */
      href?: LinkProps['href'];
    };

export interface BreadcrumbsProps {
  path: BreadcrumbItem[];
}

type TranslatedBreadcrumbItem = {
  title: string;
  segment: string;
  /**
   * Override the href of the breadcrumb item (direct click)
   */
  hrefOverride?: LinkProps['href'];
};

type BreadcrumbItemWithFullPath = {
  title: string;
  href: string;
  hrefOverride?: LinkProps['href'];
};

// eslint-disable-next-line react/display-name
export const Breadcrumbs = ({ path }: BreadcrumbsProps) => {
  const { t, translations } = useT();

  function translateItem(item: BreadcrumbItem): TranslatedBreadcrumbItem {
    if (typeof item === 'string') {
      item = {
        title: item,
        segment: item,
      };
    }

    const title = item.title ?? item.segment;

    return {
      title:
        `${title}.title` in translations
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any -- We just have to pray here that no one puts a component in a route title
            t(`${title}.title` as any)
          : t(title),
      segment: t(item.segment),
      hrefOverride: item.href,
    };
  }

  const filledPath = path.reduce<BreadcrumbItemWithFullPath[]>((acc, item) => {
    const { title, segment, hrefOverride } = translateItem(item);

    const lastItem = acc[acc.length - 1] as
      | BreadcrumbItemWithFullPath
      | undefined;

    if (lastItem) {
      acc.push({
        title,
        href: `${lastItem.href}/${segment}`,
        hrefOverride: hrefOverride,
      });
    } else {
      acc.push({
        title,
        href: `/${segment}`,
        hrefOverride: hrefOverride,
      });
    }
    return acc;
  }, []);

  return (
    <StyledBreadcrumbs>
      {filledPath.map((item, i) => {
        return (
          <Fragment
            key={`${item.title}-${item.hrefOverride?.toString() ?? item.href}`}
          >
            <StyledBreadcrumbItem href={item.hrefOverride ?? item.href}>
              {item.title}
            </StyledBreadcrumbItem>
            {i < filledPath.length - 1 ? <> / </> : null}
          </Fragment>
        );
      })}
    </StyledBreadcrumbs>
  );
};
