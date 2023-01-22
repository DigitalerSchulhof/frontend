import fs from 'fs';
import globby from 'globby';
import path from 'path';
import { __next, __src } from '../../utils';
import { getTranslation } from '../../utils/i18n';

const _pages = path.join(__src, 'pages');
const _nextPages = path.join(__next, 'pages');

// A path is the path relative to a root directory.
// A file path is the path relative to the root of the file system.

export function generatePages() {
  fs.rmSync(_nextPages, { recursive: true, force: true });
  const pageFilePaths = globby.sync('**/*.tsx', { cwd: _pages });

  pageFilePaths.forEach(generatePage);
}

/**
 * Generates the next page file for a page path.
 */
export function generatePage(pagePath: string) {
  const translatedPagePath = getTranslatedPagePath(pagePath);
  const translatedNextPageFilePath = path.join(
    _nextPages,
    translatedPagePath + '.ts'
  );

  fs.mkdirSync(path.dirname(translatedNextPageFilePath), {
    recursive: true,
  });
  fs.writeFileSync(
    translatedNextPageFilePath,
    `module.exports = require('${new Array(1 + pagePath.split('/').length)
      .fill('..')
      .join('/')}/src/pages/${pagePath.substring(
      0,
      pagePath.length - '.tsx'.length
    )}');`
  );
}

/**
 * Returns the translated next page path for a page file.
 *
 * Also works for directory paths.
 */
export function getTranslatedPagePath(pagePath: string) {
  return pagePath
    .substring(
      0,
      pagePath.length - (pagePath.endsWith('.tsx') ? '.tsx'.length : 0)
    )
    .split('/')
    .map((part) => {
      if (part.startsWith('{') && part.endsWith('}')) {
        const translation = getTranslation(part.substring(1, part.length - 1));
        if (!translation) return part; // throw new Error(`No translation found for ${part} at ${pageFilePath}`);
        if (translation.type !== 'string') {
          throw new Error(`Translation for ${part} is not a string`);
        }
        return translation.value;
      }
      return part;
    })
    .join('/');
}
