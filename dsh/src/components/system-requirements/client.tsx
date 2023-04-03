'use client';

import { useT } from '#/i18n/client';
import {
  LargeIconCookies,
  LargeIconGroupError,
  LargeIconTick,
  LargeIconVersion,
  LargeIconWarning,
} from '#/ui/Icon';
import { css, styled } from 'styled-components';

export const SystemRequirementsClient = ({ version }: { version: string }) => {
  const { t } = useT();

  const hasFullSupport = useHasFullSupport();

  return (
    <SystemRequirementsWrapper>
      <SystemRequirementsItem>
        <LargeIconVersion />
        <br />
        {t('schulhof.login.system-requirements.version', {
          version,
        })}
      </SystemRequirementsItem>
      <SystemRequirementsItem>
        <LargeIconCookies />
        <br />
        {t('schulhof.login.system-requirements.cookies')}
      </SystemRequirementsItem>
      <SystemRequirementsItem>
        <LargeIconGroupError />
        <br />
        {t('schulhof.login.system-requirements.one-user')}
      </SystemRequirementsItem>
      <SystemRequirementsItem>
        {hasFullSupport ? (
          <>
            <LargeIconTick />
            <br />
            {t('schulhof.login.system-requirements.check.yes')}
          </>
        ) : (
          <>
            <LargeIconWarning />
            <br />
            <b>{t('schulhof.login.system-requirements.check.no')}</b>
          </>
        )}
      </SystemRequirementsItem>
    </SystemRequirementsWrapper>
  );
};

export function useHasFullSupport() {
  return true;
}

const SystemRequirementsWrapper = styled.div(
  ({ theme }) => css`
    background-color: #424242;
    border-radius: ${theme.borderRadius.medium};
  `
);

const SystemRequirementsItem = styled.div(
  ({ theme }) => css`
    padding: ${theme.padding.medium};
    text-align: center;

    & > img {
      display: inline-block;
    }
  `
);
