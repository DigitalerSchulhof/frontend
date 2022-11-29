import { readJsonSync, yieldFiles, yieldModules } from '../../utils';
import * as fs from 'fs';
import * as path from 'path';

const _pages = path.resolve(__dirname, '../../../pages');

const pages = new Map<string, [string, string]>();

for (const dir of yieldModules()) {
  const pkg = readJsonSync(`${dir}/package.json`);
  if (!pkg.dsh) continue;
  if (!fs.existsSync(path.join(dir, 'pages'))) continue;

  for (const filePath of yieldFiles(path.join(dir, 'pages'))) {
    const pagePath = filePath.substring(dir.length + 'pages/'.length + 1);
    if (pagePath.includes('tsconfig.json')) continue;

    if (pages.has(pagePath)) {
      throw new Error(`Duplicate page: ${pagePath}`);
    }
    pages.set(pagePath, [pkg.name, pagePath]);
  }
}

fs.rmSync(_pages, { recursive: true, force: true });

for (const [pagePath, [pkgName, filePath]] of pages) {
  fs.mkdirSync(path.dirname(path.join(_pages, pagePath)), { recursive: true });
  fs.writeFileSync(
    path.join(_pages, pagePath),
    `export { default } from '${pkgName}/pages/${filePath.replace(/\.tsx?/, '')}';`
  );
}
