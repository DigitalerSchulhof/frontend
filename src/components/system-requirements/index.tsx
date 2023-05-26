import { changelogService } from '#/components/changelog/service';
import { useT } from '#/i18n';
import {
  LargeIconCookies,
  LargeIconGroupError,
  LargeIconVersion,
} from '#/ui/Icon';
import {
  SystemRequirementsFullSupport,
  SystemRequirementsItem,
  SystemRequirementsWrapper,
} from './client';

export const SystemRequirements = () => {
  const { t } = useT();
  const version = changelogService.getVersion();

  return (
    <SystemRequirementsWrapper>
      <SystemRequirementsItem>
        <LargeIconVersion alt='{}' />
        <br />
        {t('schulhof.login.system-requirements.version', {
          version,
        })}
      </SystemRequirementsItem>
      <SystemRequirementsItem>
        <LargeIconCookies alt='{}' />
        <br />
        {t('schulhof.login.system-requirements.cookies')}
      </SystemRequirementsItem>
      <SystemRequirementsItem>
        <LargeIconGroupError alt='{}' />
        <br />
        {t('schulhof.login.system-requirements.one-user')}
      </SystemRequirementsItem>
      <SystemRequirementsFullSupport />
    </SystemRequirementsWrapper>
  );
};
