'use client';

import { useT } from '#/i18n';
import { LargeIconError, LargeIconTick, LargeIconWarning } from '#/ui/Icon';
import { useEffect, useState } from 'react';
import { css, styled } from 'styled-components';

enum HasFullSupport {
  Yes,
  No,
  Maybe,
}

export const SystemRequirementsFullSupport = () => {
  const hasFullSupport = useHasFullSupport();

  return (
    <SystemRequirementsItem>
      <FullSupportIcon hasFullSupport={hasFullSupport} />
    </SystemRequirementsItem>
  );
};

const FullSupportIcon = ({
  hasFullSupport,
}: {
  hasFullSupport: HasFullSupport;
}) => {
  const { t } = useT();

  switch (hasFullSupport) {
    case HasFullSupport.Yes:
      return (
        <>
          <LargeIconTick />
          <br />
          {t('schulhof.login.system-requirements.check.yes')}
        </>
      );
    case HasFullSupport.Maybe:
      return (
        <>
          <LargeIconWarning />
          <br />
          <b>{t('schulhof.login.system-requirements.check.maybe')}</b>
        </>
      );
    case HasFullSupport.No:
      return (
        <>
          <LargeIconError />
          <br />
          <b>{t('schulhof.login.system-requirements.check.no')}</b>
        </>
      );
  }
};

export function useHasFullSupport() {
  const [hasFullSupport, setHasFullSupport] = useState(HasFullSupport.Maybe);

  useEffect(() => {
    // TODO: Check if the user has full support
    if (Math.random() > 0.5) {
      setHasFullSupport(HasFullSupport.Yes);
    } else {
      setHasFullSupport(HasFullSupport.No);
    }
  }, [setHasFullSupport]);

  return hasFullSupport;
}

export const SystemRequirementsWrapper = styled.div(
  ({ theme }) => css`
    background-color: #424242;
    border-radius: ${theme.borderRadius.medium};
  `
);

export const SystemRequirementsItem = styled.div(
  ({ theme }) => css`
    padding: ${theme.padding.medium};
    text-align: center;

    & > img {
      display: inline-block;
    }
  `
);
