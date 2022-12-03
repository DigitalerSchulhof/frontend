import * as fs from 'fs';
import * as path from 'path';
import { getTranslation } from '../i18n';
import { yieldModules, readJsonSync, yieldFiles, LOCALE } from '../utils';

const _pages = path.resolve(__dirname, '../../pages');

const pages = new Map<string, [string, string]>();

for (const dir of yieldModules()) {
  const pkg = readJsonSync(`${dir}/package.json`);
  if (!fs.existsSync(path.join(dir, 'pages'))) continue;

  for (const filePath of yieldFiles(path.join(dir, 'pages'))) {
    let pagePath = filePath.substring(dir.length + 'pages/'.length + 1);
    if (pagePath.endsWith('tsconfig.json')) continue;

    const translatedPagePath = pagePath
      .split('/')
      .map((p) => translatePagePathSegment(pkg.name, p, LOCALE))
      .join('/');

    if (pages.has(translatedPagePath)) {
      throw new Error(`Duplicate page: ${translatedPagePath}`);
    }
    pages.set(translatedPagePath, [pkg.name, pagePath]);
  }
}

fs.rmSync(_pages, { recursive: true, force: true });

for (const [pagePath, [pkgName, filePath]] of pages) {
  fs.mkdirSync(path.dirname(path.join(_pages, pagePath)), { recursive: true });
  fs.writeFileSync(
    path.join(_pages, pagePath),
    `export { default } from '${pkgName}/pages/${filePath.replace(
      /\.tsx?/,
      ''
    )}';`
  );
}

function translatePagePathSegment(
  packageName: string,
  segment: string,
  locale: string
): string {
  return segment.replace(/{([a-z-.]+)}/, (match, i18nKey) =>
    getTranslation(packageName, i18nKey, locale)
  );
}
