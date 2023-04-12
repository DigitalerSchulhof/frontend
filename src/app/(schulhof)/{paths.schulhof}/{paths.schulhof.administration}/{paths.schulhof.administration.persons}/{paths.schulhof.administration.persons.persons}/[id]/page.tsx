import { useRequireLogin } from '#/auth/server';
import { useT } from '#/i18n';
import { notFound, redirect } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { context } = await useRequireLogin();

  const person = await context.services.person.getById(params.id);

  if (!person) notFound();

  const { t } = useT();

  redirect(
    `/${[
      t('paths.schulhof'),
      t('paths.schulhof.administration'),
      t('paths.schulhof.administration.persons'),
      t('paths.schulhof.administration.persons.persons'),
      params.id,
      t('paths.schulhof.administration.persons.persons.details'),
    ].join('/')}`
  );
}
