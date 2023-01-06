import type { CodegenConfig } from '@graphql-codegen/cli';
import * as path from 'path';
import * as fs from 'fs';

const _packages = path.resolve(__dirname, '../../packages');

const generates: CodegenConfig['generates'] = {
  [path.join(__dirname, 'resolvers/types.ts')]: {
    plugins: ['typescript', 'typescript-resolvers'],
    schema: path.join(__dirname, 'resolvers/**/*.graphql'),
    config: {
      addUnderscoreToArgsType: true,
      mapperTypeSuffix: '_DSH_Model',
      showUnusedMappers: true,
      immutableTypes: true,
      strictScalars: true,
      scalars: {
        Date: 'Date',
      },
    },
  },
};

for (const dirName of fs.readdirSync(_packages)) {
  const dir = path.join(_packages, dirName);

  const hasBackendDir = fs.existsSync(path.join(dir, 'backend'));
  if (
    !fs.existsSync(
      path.join(dir, hasBackendDir ? 'backend/resolvers' : 'resolvers')
    )
  ) {
    continue;
  }

  generates[
    path.join(
      dir,
      hasBackendDir ? 'backend/resolvers' : 'resolvers',
      'types.ts'
    )
  ] = {
    plugins: ['typescript', 'typescript-resolvers'],
    schema: [
      hasBackendDir
        ? path.join(_packages, '*/backend/resolvers/**/*.graphql')
        : path.join(_packages, '*/resolvers/**/*.graphql'),
      path.join(__dirname, 'resolvers/**/*.graphql'),
    ],
    config: {
      addUnderscoreToArgsType: true,
      mapperTypeSuffix: '_DSH_Model',
      showUnusedMappers: true,
      immutableTypes: true,
      strictScalars: true,
      scalars: {
        Date: 'Date',
      },
    },
  };
}

let config: CodegenConfig = {
  generates,
};

export default config;
