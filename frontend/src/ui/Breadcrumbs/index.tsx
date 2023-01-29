import { TranslationAST, useT } from '@i18n';
import React, { Fragment, useMemo } from 'react';
import styled from 'styled-components';
import { Link } from '../Link';

export type BreadcrumbItemString = string | TranslationAST<string>;

/**
 * @example
 * ```ts
 * const breadcrumbs = [
 *   t('paths.schulhof'),
 *   t('paths.schulhof.administration'),
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
 *   getTranslation('paths.schulhof'),
 *   getTranslation('paths.schulhof.administration'),
 *   {
 *     title: getTranslation('paths.schulhof.administration.persons.title'),
 *     segment: getTranslation('paths.schulhof.administration.persons'),
 *     href: [
 *       getTranslation('paths.schulhof'),
 *       getTranslation('paths.schulhof.administration'),
 *     ],
 *   },
 *   getTranslation('paths.schulhof.administration.persons.persons'),
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
  | BreadcrumbItemString
  | {
      /**
       * The title of the breadcrumb item
       */
      title: BreadcrumbItemString;
      /**
       * The value to be used for the current item in constructing the href of the succeeding items
       */
      segment: BreadcrumbItemString;
      /**
       * The href of the breadcrumb item (direct click)
       */
      href?: BreadcrumbItemString | BreadcrumbItemString[];
    };

export interface BreadcrumbsProps {
  path: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ path }) => {
  const t = useT();

  // If a path item is a string, its value is simply appended to the previous item's href.
  const filledPath = useMemo(
    () =>
      path.reduce<
        {
          title: string;
          /**
           * The href of the breadcrumb item constructed from the previous segments and the current item's `segment` value
           */
          segmented: string;
          /**
           * If provided, the explicit href of the breadcrumb item (overwrites the `segmented` value)
           */
          href?: string;
        }[]
      >((acc, item) => {
        let title;
        let segment;
        let href: string | undefined;

        if (typeof item === 'string') {
          title = item;
          segment = item;
        } else if ('ast' in item) {
          title = t(item);
          segment = t(item);
        } else {
          title = typeof item.title === 'string' ? item.title : t(item.title);
          segment =
            typeof item.segment === 'string' ? item.segment : t(item.segment);
          if (item.href) {
            if (typeof item.href === 'string') {
              href = item.href;
            } else if ('ast' in item.href) {
              href = t(item.href);
            } else {
              href = `/${item.href
                .map((h) => (typeof h === 'string' ? h : t(h)))
                .join('/')}`;
            }
          }
        }

        const lastItem = acc[acc.length - 1];
        if (lastItem) {
          acc.push({
            title,
            segmented: `${lastItem.segmented}/${segment}`,
            href,
          });
        } else {
          acc.push({
            title,
            segmented: `/${segment}`,
            href,
          });
        }
        return acc;
      }, []),
    [path]
  );

  return (
    <StyledBreadcrumbs>
      {filledPath.map((item, i) => {
        return (
          <Fragment key={`${item.title}-${item.href}`}>
            <StyledBreadcrumbItem href={item.href ?? item.segmented}>
              {item.title}
            </StyledBreadcrumbItem>
            {i < filledPath.length - 1 ? <> / </> : null}
          </Fragment>
        );
      })}
    </StyledBreadcrumbs>
  );
};

export const StyledBreadcrumbs = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const StyledBreadcrumbItem = Link;
