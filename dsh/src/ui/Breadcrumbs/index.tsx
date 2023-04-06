'use client';

import { useT } from '#/i18n/client';
import { TranslationsWithStringTypeAndNoVariables } from '#/i18n/translations';
import { Link } from '#/ui/Link';
import React, { Fragment, memo } from 'react';
import styled from 'styled-components';

/**
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
 *     title: 'paths.schulhof.administration.persons.title',
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
  | TranslationsWithStringTypeAndNoVariables
  | {
      /**
       * The title of the breadcrumb item
       */
      title: TranslationsWithStringTypeAndNoVariables;
      /**
       * The value to be used for the current item in constructing the href of the succeeding items
       */
      segment: TranslationsWithStringTypeAndNoVariables;
      /**
       * Override the href of the breadcrumb item (direct click)
       */
      hrefOverride?: TranslationsWithStringTypeAndNoVariables[];
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
  hrefOverride?: string[];
};

type BreadcrumbItemWithFullPath = {
  title: string;
  href: string;
  hrefOverride?: string;
};

// eslint-disable-next-line react/display-name
export const Breadcrumbs: React.FC<BreadcrumbsProps> = memo(({ path }) => {
  const { t } = useT();

  function translateItem(item: BreadcrumbItem): TranslatedBreadcrumbItem {
    if (typeof item === 'string') {
      const translation = t(item);

      return {
        title: translation,
        segment: translation,
      };
    } else {
      return {
        title: t(item.title),
        segment: t(item.segment),
        hrefOverride: item.hrefOverride?.map(t),
      };
    }
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
        hrefOverride: hrefOverride?.join('/'),
      });
    } else {
      acc.push({
        title,
        href: `/${segment}`,
        hrefOverride: hrefOverride?.join('/'),
      });
    }
    return acc;
  }, []);

  return (
    <StyledBreadcrumbs>
      {filledPath.map((item, i) => {
        return (
          <Fragment key={`${item.title}-${item.hrefOverride ?? item.href}`}>
            <StyledBreadcrumbItem href={item.hrefOverride ?? item.href}>
              {item.title}
            </StyledBreadcrumbItem>
            {i < filledPath.length - 1 ? <> / </> : null}
          </Fragment>
        );
      })}
    </StyledBreadcrumbs>
  );
});

export const StyledBreadcrumbs = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const StyledBreadcrumbItem = Link;
