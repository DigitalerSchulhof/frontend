import { useContext } from 'react';
import { ClientTranslations, translationsContext } from './provider';

export const useTranslations = () => {
  const translations = useContext(translationsContext);

  function t(key: string) {
    const translation = translations[key] as
      | ClientTranslations[keyof ClientTranslations]
      | undefined;

    if (!translation) {
      return key;
    }

    if (translation.type === 'string') {
      // @ts-expect-error
      return translation.ast[0].value;
    } else {
      // @ts-expect-error
      return translation.asts.map((v) => v[0].value);
    }
  }

  return {
    t,
    tIfCurly: (key: string) => {
      if (key.startsWith('{') && key.endsWith('}')) {
        return t(key.slice(1, -1));
      }
      return key;
    },
  };
};
