import * as path from 'path';
import * as yaml from 'yaml';
import * as fs from 'fs';
import { __frontend } from '#/utils/paths';

export type ChangelogId = '0_11_4';

export type ChangelogEntry = {
  id: ChangelogId;
  version: string;
  date: Date;
};

class ChangelogService {
  private readonly changelogPath = path.join(__frontend, 'changelog.yml');

  private changelogVersionsMap: Map<ChangelogId, ChangelogEntry> | null = null;

  loadChangelog(): void {
    const changelogFileContent = fs.readFileSync(this.changelogPath, 'utf-8');
    const loadedChangelog = yaml.parse(changelogFileContent) as {
      version: Record<string, { version: string; date: string }>;
    };

    this.changelogVersionsMap = new Map();

    for (const [id, entry] of Object.entries(loadedChangelog.version)) {
      const changelogId = id as ChangelogId;

      this.changelogVersionsMap.set(changelogId, {
        id: changelogId,
        version: entry.version,
        date: new Date(entry.date),
      });
    }
  }

  getChangelogEntry(id: ChangelogId): ChangelogEntry {
    if (!this.changelogVersionsMap) {
      throw new Error('Changelog not loaded');
    }

    return this.changelogVersionsMap.get(id)!;
  }

  getChangelogEntries(): ChangelogEntry[] {
    if (!this.changelogVersionsMap) {
      throw new Error('Changelog not loaded');
    }

    return [...this.changelogVersionsMap.values()];
  }
}

export const changelogService = new ChangelogService();
changelogService.loadChangelog();
