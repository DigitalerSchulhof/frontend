'use client';

import { useTranslations } from '#/i18n/t';

export interface TProps {
  t: string;
}

export const T = ({ t }: TProps) => {
  const { t: tFunc } = useTranslations();

  return tFunc(t);
};
