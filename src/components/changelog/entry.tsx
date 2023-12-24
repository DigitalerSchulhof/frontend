import { T, useT } from '#/i18n';
import { Heading } from '#/ui/Heading';
import type { ChangelogEntry as ChangelogEntryType } from './service';

export const ChangelogEntry = ({ entry }: { entry: ChangelogEntryType }) => {
  const { t } = useT();

  const changeset = t(`changelog.versions.${entry.id}.changeset`);

  return (
    <section>
      <Heading size='4'>
        <T
          t='schulhof.login.changelog.section-title'
          args={{
            version: entry.version,
            date: entry.date,
          }}
        />
      </Heading>
      <ul>
        {changeset.map((change, i) => (
          <li key={i}>{change}</li>
        ))}
      </ul>
    </section>
  );
};
