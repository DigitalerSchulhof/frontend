import { changelogService } from '#/components/changelog/service';
import { useT } from '#/i18n';
import {
  LargeIconCookies,
  LargeIconGroupError,
  LargeIconScript,
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
        <LargeIconScript />
        <br />
        {t('schulhof.login.system-requirements.javascript')}
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
