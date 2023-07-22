import type { AppSettings } from '#/settings/client';
import settings from '../../../settings.json';

export async function getSettings(): Promise<AppSettings> {
  return settings as AppSettings;
}
