import { AppSettings } from '#/settings/context';
import settings from '../../../settings.json';

export async function getSettings(): Promise<AppSettings> {
  return settings as AppSettings;
}
