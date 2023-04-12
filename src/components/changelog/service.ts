import * as path from 'path';
import * as yaml from 'yaml';
import * as fs from 'fs';
import { __dsh } from '#/utils/paths';

export type ChangelogId = '0_11_4';

export type ChangelogEntry = {
  id: ChangelogId;
  version: string;
  date: Date;
};

class ChangelogService {
  private readonly changelogPath = path.join(__dsh, 'changelog.yml');

  private changelogVersions: ChangelogEntry[] | null = null;

  loadChangelog(): void {
    const changelogFileContent = fs.readFileSync(this.changelogPath, 'utf-8');
    const loadedChangelog = yaml.parse(changelogFileContent) as {
      version: Record<string, { version: string; date: string }>;
    };

    this.changelogVersions = Object.entries(loadedChangelog.version).map(
      ([id, entry]) => {
        const changelogId = id as ChangelogId;

        return {
          id: changelogId,
          version: entry.version,
          date: new Date(entry.date),
        };
      }
    );
  }

  getChangelogEntries(): ChangelogEntry[] {
    if (!this.changelogVersions) {
      throw new Error('Changelog not loaded');
    }

    return this.changelogVersions;
  }

  getVersion(): string {
    if (!this.changelogVersions) {
      throw new Error('Changelog not loaded');
    }

    return this.changelogVersions[0].version;
  }
}

export const changelogService = new ChangelogService();
changelogService.loadChangelog();
