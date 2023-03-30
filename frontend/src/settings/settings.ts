import { AppSettings } from '#/settings/context';
import settings from '../../../settings.json';

export function getSettings(): AppSettings {
  return settings as AppSettings;
}
