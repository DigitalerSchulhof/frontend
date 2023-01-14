import IntlMessageFormat, { PrimitiveType } from 'intl-messageformat';
import React from 'react';
import { useAppSettings } from './AppSettingsContext';

export { useMutation, useQuery, useSubscription } from 'urql';

export interface DataType {
  [K: string]: DataType | PrimitiveType | ((part: string) => any);
}

export function useT() {
  const settings = useAppSettings();
  const flattenedSettings = flattenKeys(settings);

  return (key: string, data?: DataType): string | string[] => {
    const flattenedData = flattenKeys(data);
    key = fromBase64(key);

    try {
      return new IntlMessageFormat(key, settings.locale).format({
        i: (c) => <i>{c}</i>,
        b: (c) => <b>{c}</b>,
        ...flattenedSettings,
        ...flattenedData,
      }) as string;
    } catch (e) {
      console.log(key, settings, flattenedSettings, data, flattenedData);
      console.error(e);
      return key;
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
        acc[key.replace(/_/g, '__')] = val;
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
