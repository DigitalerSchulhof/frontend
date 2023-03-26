import * as path from 'path';

/* eslint-disable @typescript-eslint/naming-convention */
let __frontend;
if (__dirname.includes('.next')) {
  [__frontend] = __dirname.split('.next');
} else {
  __frontend = path.resolve(__dirname, '../..');
}
export { __frontend };
export const __locales = path.resolve(__frontend, 'locales');
export const __src = path.resolve(__frontend, 'src');
export const __app = path.resolve(__src, 'app');
export const __nextApp = path.resolve(__frontend, 'app');
/* eslint-enable @typescript-eslint/naming-convention */
