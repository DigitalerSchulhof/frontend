import { getContext } from '#/auth/component';
import { changelogService } from '#/components/changelog/service';
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
  const { t } = getContext();
  const version = changelogService.getVersion();

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
      <SystemRequirementsFullSupport />
    </SystemRequirementsWrapper>
  );
};
