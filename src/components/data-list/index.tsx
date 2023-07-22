'use client';

import { List } from '#/ui/List';
import type { WrappedActionResult } from '#/utils/action';
import { unwrapAction } from '#/utils/client';
import React, { Fragment, useEffect, useState } from 'react';

export type Paginateable = { items: { id: string }[]; total: number };

export type DataListProps<T extends Paginateable> = Omit<
  React.ComponentProps<typeof List>,
  'children'
> & {
  fetch(offset: number, limit: number): Promise<WrappedActionResult<T>>;
  headerRow: React.ReactNode;
  loadingRow: React.ReactNode;
  errorRow: React.ReactNode;
  emptyRow: React.ReactNode;
  dataRow(item: T['items'][number]): React.ReactNode;
};

// TODO: Load default limit from user settings/Browser
const DEFAULT_LIMIT = -1;

export const DataList = <T extends Paginateable>({
  fetch,
  headerRow,
  loadingRow,
  errorRow,
  emptyRow,
  dataRow,
  ...props
}: DataListProps<T>) => {
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let mounted = true as boolean;

    void (async () => {
      setIsLoading(true);

      try {
        const newData = await unwrapAction(fetch(offset, limit));

        if (mounted) {
          setData(newData);
          setHasError(false);
        }
      } catch (e) {
        if (mounted) {
          setData(null);
          setHasError(true);
        }
        throw e;
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [offset, limit, setData, setIsLoading, setHasError, fetch]);

  return (
    <List {...props} isLoading={isLoading}>
      {headerRow}
      {/* !hasError and !data is only true on the first run. After that (unless we return null from fetch), either must always be defined. */}
      {isLoading && !hasError && !data ? loadingRow : null}
      {data && !data.items.length ? emptyRow : null}
      {data
        ? data.items.map((row) => (
            <Fragment key={row.id}>{dataRow(row)}</Fragment>
          ))
        : null}
      {hasError ? errorRow : null}
      {/* TODO: Pagination */}
    </List>
  );
};
