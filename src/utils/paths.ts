import * as path from 'path';

/* eslint-disable @typescript-eslint/naming-convention */
let __dsh: string;
if (__dirname.includes('.next')) {
  [__dsh] = __dirname.split('.next');
} else {
  __dsh = path.resolve(__dirname, '../..');
}
export { __dsh };
export const __locales = path.resolve(__dsh, 'locales');
export const __cache = path.resolve(__dsh, '.cache');
export const __src = path.resolve(__dsh, 'src');
export const __app = path.resolve(__src, 'app');
export const __nextApp = path.resolve(__dsh, 'app');
/* eslint-enable @typescript-eslint/naming-convention */
