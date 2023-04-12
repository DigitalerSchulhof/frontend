import { Heading } from '#/ui/Heading';
import { PersonDetailsProps } from '..';

export type PersonDetailsChangePersonalDataSectionProps = Pick<
  PersonDetailsProps,
  'context' | 'person' | 'account'
>;

export const PersonDetailsChangePersonalDataSection = ({
  context,
  person,
  account,
}: PersonDetailsChangePersonalDataSectionProps) => {
  return (
    <>
      <Heading
        size='2'
        t='schulhof.administration.sections.persons.slices.persons.details.change-personal-data.title'
      />
    </>
  );
};
