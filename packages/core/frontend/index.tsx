import IntlMessageFormat, { PrimitiveType } from 'intl-messageformat';
import React from 'react';
import { useAppSettings } from './AppSettingsContext';

export { useMutation } from 'urql';

export declare function getShell<T>(name: string, dynamicImport?: boolean): T[];

export function useT() {
  const settings = useAppSettings();
  const flattenedSettings = flattenKeys(settings);

  function tFunc(
    key: string,
    data?: Record<string, PrimitiveType | ((part: string) => any)>
  ): string {
    key = fromBase64(key);

    try {
      return new IntlMessageFormat(key, settings.locale).format({
        i: (c) => <i>{c}</i>,
        b: (c) => <b>{c}</b>,
        ...flattenedSettings,
        ...flattenKeys(data),
      }) as string;
    } catch (e) {
      console.log(key, flattenedSettings, data);
      console.error(e);
      return key;
    }
  }

  return {
    t: tFunc,
    T: ({
      as: Component = React.Fragment,
      vars,
      children,
      ...props
    }: {
      as?: React.ElementType;
      vars?: Record<string, PrimitiveType | ((part: string) => any)>;
      children: string | string[];
    }): JSX.Element => {
      if (typeof children === 'string') {
        return <Component {...props}>{tFunc(children, vars)}</Component>;
      }
      return (
        <>
          {children.map((c: string, i: number) => {
            const translated = tFunc(c, vars);
            return (
              <Component key={`${c}-${i}`} {...props}>
                {Array.isArray(translated)
                  ? translated.map((tr, i) =>
                      typeof tr === 'string' ? (
                        tr
                      ) : (
                        <React.Fragment key={`${c}-${i}`}>{tr}</React.Fragment>
                      )
                    )
                  : translated}
              </Component>
            );
          })}
        </>
      );
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
