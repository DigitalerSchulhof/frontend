import fs from 'fs';
import path from 'path';
import { getTranslation } from '../i18n';
import { LOCALE, readJsonSync, yieldFiles, yieldModules } from '../utils';

const _pages = path.resolve(__dirname, '../../pages');

const pages = new Map<string, [string, string]>();

for (const [dir, moduleName] of yieldModules()) {
  const pkg = readJsonSync(`${dir}/package.json`);
  const hasFrontendDir = fs.existsSync(path.join(dir, 'frontend'));
  if (
    hasFrontendDir
      ? !fs.existsSync(path.join(dir, 'frontend/pages'))
      : !fs.existsSync(path.join(dir, 'pages'))
  ) {
    continue;
  }

  for (const filePath of yieldFiles(
    path.join(dir, hasFrontendDir ? 'frontend/pages' : 'pages')
  )) {
    let pagePath = filePath.substring(
      dir.length +
        (hasFrontendDir ? 'frontend/pages/'.length : 'pages/'.length) +
        1
    );
    if (pagePath === 'tsconfig.json') continue;

    const translatedPagePath = pagePath
      .split('/')
      .map((p) => translatePagePathSegment(pkg.name, p, LOCALE))
      .join('/');

    if (pages.has(translatedPagePath)) {
      throw new Error(`Duplicate page: ${translatedPagePath}`);
    }
    pages.set(translatedPagePath, [
      moduleName,
      (hasFrontendDir ? 'frontend/pages/' : 'pages/') + pagePath,
    ]);
  }
}

fs.rmSync(_pages, { recursive: true, force: true });

for (const [pagePath, [pkgName, filePath]] of pages) {
  fs.mkdirSync(path.dirname(path.join(_pages, pagePath)), { recursive: true });
  fs.writeFileSync(
    path.join(_pages, pagePath.replace(/\.tsx/, '.ts')),
    `import * as helloThere from '${pkgName}/${filePath.replace(/\.tsx?/, '')}';
module.exports = helloThere;`
  );
}

function translatePagePathSegment(
  packageName: string,
  segment: string,
  locale: string
): string {
  return segment.replace(/{([a-z-.]+)}/, (_, i18nKey) => {
    const val = getTranslation(packageName, i18nKey, locale);
    if (typeof val === 'string') return val;
    throw new Error('Invalid page path segment: ' + segment);
  });
}
