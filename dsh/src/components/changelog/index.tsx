import { VisibilityToggle } from '#/components/visibility-toggle';
import { T } from '#/i18n';
import { getServerT } from '#/i18n/server';
import { Heading } from '#/ui/Heading';
import { ChangelogEntry } from './entry';
import { changelogService } from './service';

export const Changelog = () => {
  const { t } = getServerT();

  const [mostRecentEntry, ...oldEntries] =
    changelogService.getChangelogEntries();

  return (
    <>
      <Heading size='2'>
        <T t='schulhof.login.changelog.title' />
      </Heading>
      <div>
        <ChangelogEntry entry={mostRecentEntry} />
        <VisibilityToggle
          show={t('schulhof.login.changelog.all.show')}
          hide={t('schulhof.login.changelog.all.hide')}
          content={oldEntries.map((entry, i) => (
            <VisibilityToggle
              key={i}
              show={t('schulhof.login.changelog.specific.show', {
                version: entry.version,
              })}
              hide={t('schulhof.login.changelog.specific.hide', {
                version: entry.version,
              })}
              content={<ChangelogEntry entry={entry} />}
            />
          ))}
        />
      </div>
    </>
  );
};
