import fs from 'fs';
import path from 'path';
import { __src } from '../utils';
import { getTranslations } from '../utils/i18n';

export function generateI18n() {
  fs.writeFileSync(
    path.join(__src, 'i18n/translations.d.ts'),
    `export interface Translations {
  ${Object.entries(getTranslations())
    .map(
      ([key, value]) =>
        `'${key}': ${typeof value.value === 'string' ? 'string' : 'string[]'};`
    )
    .join('\n  ')}
}`
  );
}

generateI18n();
