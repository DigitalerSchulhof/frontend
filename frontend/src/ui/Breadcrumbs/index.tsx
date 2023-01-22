import { Link } from '../Link';
import React, { Fragment, useMemo } from 'react';
import styled from 'styled-components';

export type BreadcrumbItem =
  | {
      title: string;
      href: string;
    }
  | string;

export interface BreadcrumbsProps {
  path: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ path }) => {
  // If a path item is a string, its value is simply appended to the previous item's href.
  const filledPath = useMemo(
    () =>
      path.reduce<(BreadcrumbItem & object)[]>((acc, item) => {
        if (typeof item === 'string') {
          const lastItem = acc[acc.length - 1];
          if (lastItem) {
            item = {
              title: item,
              href: `${lastItem.href}/${item}`,
            };
          } else {
            item = {
              title: item,
              href: `/${item}`,
            };
          }
        }
        acc.push(item);
        return acc;
      }, []),
    [path]
  );

  return (
    <StyledBreadcrumbs>
      {filledPath.map((item, i) => {
        return (
          <Fragment key={`${item.title}-${item.href}`}>
            <StyledBreadcrumbItem href={item.href}>
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
