import chokidar from 'chokidar';
import fs from 'fs';
import path from 'path';
import { isWatchMode, __next, __src } from '../../utils';
import { generatePage, generatePages, getTranslatedPagePath } from './page';

const _pages = path.join(__src, 'pages');
const _nextPages = path.join(__next, 'pages');

generatePages();

if (isWatchMode()) {
  const wacher = chokidar
    .watch('.', {
      cwd: _pages,
      persistent: true,
      ignoreInitial: true,
    })
    .on('add', (pagePath) => {
      generatePage(pagePath);
    })
    .on('unlink', (pagePath) => {
      const translatedPagePath = getTranslatedPagePath(pagePath);
      const translatedNextPageFilePath = path.join(
        _nextPages,
        translatedPagePath + '.ts'
      );
      fs.rmSync(translatedNextPageFilePath, { force: true });
    })
    .on('unlinkDir', (dirPath) => {
      const translatedDirPath = getTranslatedPagePath(dirPath);
      const translatedNextDirPath = path.join(_nextPages, translatedDirPath);
      fs.rmSync(translatedNextDirPath, { recursive: true, force: true });
    });

  // TODO: Watch translations

  process.on('exit', () => {
    wacher.close();
  });
}
