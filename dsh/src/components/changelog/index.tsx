import { VisibilityToggle } from '#/components/visibility-toggle';
import { T, useT } from '#/i18n';
import { Heading } from '#/ui/Heading';
import { ChangelogEntry } from './entry';
import { changelogService } from './service';

export const Changelog = () => {
  const { t } = useT();

  const [mostRecentEntry, ...oldEntries] =
    changelogService.getChangelogEntries();

  return (
    <>
      <Heading size='2'>
        <T t='schulhof.login.changelog.title' />
      </Heading>
      <div>
        <VisibilityToggle
          show={t('schulhof.login.changelog.specific.show', {
            version: mostRecentEntry.version,
          })}
          hide={t('schulhof.login.changelog.specific.hide', {
            version: mostRecentEntry.version,
          })}
          content={<ChangelogEntry entry={mostRecentEntry} />}
          defaultVisible
        />

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
