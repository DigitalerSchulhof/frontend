// eslint-disable-next-line no-undef -- graphql-codegen only supports CommonJS modules
module.exports.plugin = () => ({
  prepend: ['/* eslint-disable */', '// @ts-nocheck'],
  content: 'export type { BackendContext };',
});
