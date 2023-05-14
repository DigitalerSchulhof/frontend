import { TranslationsWithStringTypeAndNoVariables } from '#/i18n/translations';
import { Heading } from '#/ui/Heading';

export type AdministrationGroupProps = {
  title: TranslationsWithStringTypeAndNoVariables;
  children: React.ReactNode;
};

export const AdministrationGroup = ({
  title,
  children,
}: AdministrationGroupProps) => {
  return (
    <>
      <Heading size='2' t={title} />
      <ul>{children}</ul>
    </>
  );
};
