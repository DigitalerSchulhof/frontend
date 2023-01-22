import fs from 'fs';
import globby from 'globby';
import path from 'path';
import { __next, __root, __src } from '../utils';
import { getTranslation } from '../utils/i18n';

const _pages = path.join(__src, 'pages');
const _nextPages = path.join(__next, 'pages');

export function generatePages() {
  fs.rmSync(_nextPages, { recursive: true, force: true });

  const pageFiles = globby.sync('**/*.tsx', { cwd: _pages });

  for (const pageFile of pageFiles) {
    const pagePath = pageFile
      .substring(0, pageFile.length - '.tsx'.length)
      .split('/')
      .map((part) => {
        if (part.startsWith('{') && part.endsWith('}')) {
          const translation = getTranslation(
            part.substring(1, part.length - 1)
          );
          if (!translation) throw new Error(`No translation found for ${part}`);
          if (translation.type !== 'string') {
            throw new Error(`Translation for ${part} is not a string`);
          }
          return translation.value;
        }
        return part;
      })
      .join('/');

    const nextPagePath = path.join(_nextPages, pagePath + '.ts');

    fs.mkdirSync(path.dirname(nextPagePath), {
      recursive: true,
    });
    fs.writeFileSync(
      nextPagePath,
      `module.exports = require('${new Array(1 + pageFile.split('/').length)
        .fill('..')
        .join('/')}/src/pages/${pageFile.substring(
        0,
        pageFile.length - '.tsx'.length
      )}');`
    );
  }
}

generatePages();
