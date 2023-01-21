import fs from 'fs';
import globby from 'globby';
import path from 'path';
import { __next, __root, __src } from '../utils';
import { translate } from '../utils/i18n';

const _pages = path.join(__src, 'pages');
const _nextPages = path.join(__next, 'pages');

export function generatePages() {
  fs.rmSync(_nextPages, { recursive: true });

  const pageFiles = globby.sync('**/*.tsx', { cwd: _pages });

  for (const pageFile of pageFiles) {
    const pagePath = pageFile
      .substring(0, pageFile.length - '.tsx'.length)
      .split('/')
      .map((part) =>
        part.startsWith('{') && part.endsWith('}')
          ? translate(part.substring(1, part.length - 1))
          : part
      )
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
