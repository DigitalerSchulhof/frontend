import { useT } from '@i18n';
import { path } from '.';
import { AdministrationElementCard } from '../../overview';

export const Card = () => {
  const t = useT();

  return (
    <AdministrationElementCard
      title={t('schulhof.administration.persons.persons.card.title')}
      description={t(
        'schulhof.administration.persons.persons.card.description'
      )}
      href={path}
    />
  );
};
