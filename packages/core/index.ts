import { translate } from './translate';

type TFunction = (key: string) => string;

export declare function getShell<T>(name: string): T[];
export function useT(): { t: TFunction } {
  return {
    t(key: string) {
      return translate(atob(key), {});
    },
  };
}
