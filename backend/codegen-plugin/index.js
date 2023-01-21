module.exports.plugin = () => ({
  prepend: ['// @ts-nocheck', '/* eslint-disable */'],
  content: 'export type { BackendContext };',
});
