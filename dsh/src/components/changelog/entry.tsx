import { T } from '#/i18n';
import { getServerT } from '#/i18n/server';
import { Heading } from '#/ui/Heading';
import { ChangelogEntry as ChangelogEntryType } from './service';

export const ChangelogEntry = ({ entry }: { entry: ChangelogEntryType }) => {
  const { t } = getServerT();

  const changeset = t(`schulhof.changelog.version.${entry.id}.changeset`);

  return (
    <section>
      <Heading size='4'>
        <T
          t='schulhof.login.changelog.heading'
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
