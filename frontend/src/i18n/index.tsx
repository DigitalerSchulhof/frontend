import IntlMessageFormat from 'intl-messageformat';
import { useAppSettings } from '../settings';
import { Translations } from './translations';

export function useT() {
  const settings = useAppSettings();
  const flattenedSettings = flattenKeys(settings);

  return <K extends keyof Translations>(key: K, data?: {}): Translations[K] => {
    // At runtime, this function actually receives base64-encoded already translated strings.
    // Its purpose is merely to fill in the ICU message syntax stuff.
    const flattenedData = flattenKeys(data);
    key = fromBase64(key) as K;

    try {
      // Array return values are already converted to an array of t-calls, so we technically _always_ return strings
      // even though our function signature says otherwise.
      return new IntlMessageFormat(key, settings.locale).format({
        i: (c) => <i>{c}</i>,
        b: (c) => <b>{c}</b>,
        ...flattenedSettings,
        ...flattenedData,
      }) as any;
    } catch (e) {
      console.error('Failed to format translation', {
        key,
        settings,
        flattenedSettings,
        data,
        flattenedData,
      });
      return key as any;
    }
  };
}

function flattenKeys(obj: any): any {
  if (typeof obj === 'object' && obj !== null) {
    return Object.keys(obj).reduce<Record<string, any>>((acc, key) => {
      const val = obj[key];
      if (
        typeof val === 'object' &&
        val !== null &&
        val instanceof Date === false
      ) {
        const flatObject = flattenKeys(val);
        Object.keys(flatObject).forEach((k) => {
          acc[`${key}_${k}`] = flatObject[k];
        });
      } else {
        acc[key] = val;
      }

      return acc;
    }, {});
  }
  return obj;
}

// https://stackoverflow.com/a/30106551/12405307
export function fromBase64(str: string): string {
  try {
    return decodeURIComponent(
      atob(str)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
  } catch (e) {
    console.log('Error decoding %s', str);
    console.error(e);
    return str;
  }
}
