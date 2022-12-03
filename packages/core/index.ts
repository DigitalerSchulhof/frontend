import IntlMessageFormat from 'intl-messageformat';
import { useAppSettings } from './AppSettingsContext';

type TFunction = (key: string) => string;

export declare function getShell<T>(name: string): T[];
export function useT(): { t: TFunction } {
  const settings = useAppSettings();
  const flattenedSettings = flattenKeys(settings);

  return {
    t(key: string, data?: Record<string, any>) {
      key = fromBase64(key);

      try {
        return new IntlMessageFormat(key, settings.locale).format({
          ...flattenedSettings,
          ...flattenKeys(data),
        }) as string;
      } catch (e) {
        console.log(key, flattenedSettings, data);
        console.error(e);
        return key;
      }
    },
  };
}

function flattenKeys(obj: any): any {
  if (typeof obj === 'object' && obj !== null) {
    return Object.keys(obj).reduce<Record<string, any>>((acc, key) => {
      const val = obj[key];
      if (typeof val === 'object' && val !== null) {
        const flatObject = flattenKeys(val);
        Object.keys(flatObject).forEach((k) => {
          acc[`${key}_${k}`] = flatObject[k];
        });
      } else {
        acc[key.replace(/_/g, '__')] = val;
      }

      return acc;
    }, {});
  }
  return obj;
}

// https://stackoverflow.com/a/30106551/12405307
function fromBase64(str: string): string {
  return decodeURIComponent(
    atob(str)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
}
