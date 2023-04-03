import { changelogService } from '#/components/changelog/service';
import { SystemRequirementsClient } from '#/components/system-requirements/client';

export const SystemRequirements = () => {
  const version = changelogService.getVersion();

  return <SystemRequirementsClient version={version} />;
};
