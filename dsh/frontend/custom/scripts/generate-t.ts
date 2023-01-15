import fs from 'fs';
import globby from 'globby';
import path from 'path';
import {
  packageDefaultLocale,
  packageTranslations,
  reloadTranslations,
} from '../i18n';
import { readJsonSync } from '../utils';

const _packages = path.resolve(__dirname, '../../../../packages');

reloadTranslations();

const flatTranslations: {
  key: string;
  type: 'string' | 'string[]';
}[] = [];

for (const [pkg, locales] of Object.entries(packageTranslations)) {
  const strings = locales[packageDefaultLocale[pkg]];

  flatTranslations.push(
    ...Object.entries(strings).map(
      ([key, value]) =>
        ({
          key: `${pkg}:${key}`,
          type: Array.isArray(value.value) ? 'string[]' : 'string',
        } as const)
    )
  );
}

for (const dirName of fs.readdirSync(_packages)) {
  const dir = path.join(_packages, dirName);
  if (!fs.statSync(dir).isDirectory()) continue;

  const pkg = readJsonSync(path.join(dir, 'package.json'));

  if (!pkg.dependencies || '@dsh/core' in pkg.dependencies === false) continue;

  const pkgStrings = flatTranslations.map((t) => ({
    ...t,
    key: t.key.replace(pkg.name + ':', ''),
  }));

  const tsconfigPaths = globby.sync(path.join(dir, '**/tsconfig.json'));

  for (const tsconfigPath of tsconfigPaths) {
    if (tsconfigPath.includes('node_modules')) continue;
    const tsconfig = readJsonSync(tsconfigPath);
    const extendsPath = tsconfig.extends as string;
    if (!extendsPath) continue;
    if (!extendsPath.includes('tsconfig.frontend.json')) continue;

    fs.writeFileSync(
      path.join(
        tsconfigPath.substring(
          0,
          tsconfigPath.length - 'tsconfig.json'.length
        ) + 't.d.ts'
      ),
      `import { DataType } from '@dsh/core/frontend';

export type Strings = { ${pkgStrings
        .map(({ key, type }) => `'${key}': ${type}`)
        .join('; ')} };

declare module '@dsh/core/frontend' {
  export function useT(): <K extends keyof Strings>(key: K, data?: DataType) => Strings[K];
}`
    );
  }
}
