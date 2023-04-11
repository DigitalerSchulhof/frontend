'use client';

import { useT } from '#/i18n/client';
import { useLog } from '#/log/client';
import { BreadcrumbItem, Breadcrumbs } from '#/ui/Breadcrumbs';
import { useSelectedLayoutSegment } from 'next/navigation';
import { useMemo } from 'react';

export const LoginBreadcrumbs = () => {
  const breadcrumbsPath = useBreadcrumbPath();

  return <Breadcrumbs path={breadcrumbsPath} />;
};

function useBreadcrumbPath(): BreadcrumbItem[] {
  const { t } = useT();
  const log = useLog();

  const SELECTED_LAYOUT_SEGMENT_MAPPINGS = useMemo(
    () =>
      new Map<string, BreadcrumbItem[]>([
        [t('paths.schulhof.login'), ['paths.schulhof', 'paths.schulhof.login']],
        [
          t('paths.schulhof.forgot-password'),
          ['paths.schulhof', 'paths.schulhof.forgot-password'],
        ],
      ]),
    [t]
  );

  const selectedLayoutSegment = useSelectedLayoutSegment();

  return useMemo(() => {
    if (!selectedLayoutSegment) {
      log.error('No selected layout segment found');

      return [
        {
          title: 'generic.error',
          segment: '{/}',
        },
      ];
    }

    if (SELECTED_LAYOUT_SEGMENT_MAPPINGS.has(selectedLayoutSegment)) {
      return SELECTED_LAYOUT_SEGMENT_MAPPINGS.get(selectedLayoutSegment)!;
    }

    log.error('No breadcrumb path found for segment', selectedLayoutSegment);

    return [
      {
        title: 'generic.error',
        segment: '{/}',
      },
    ];
  }, [log, SELECTED_LAYOUT_SEGMENT_MAPPINGS, selectedLayoutSegment]);
}
