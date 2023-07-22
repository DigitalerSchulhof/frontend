'use client';

import type { FormOfAddress } from '#/services/interfaces/account';
import { useState } from 'react';
import type { LoadPersonsFilter } from '../action';
import { PersonsTableContent } from './content';
import { PersonsTableFilter } from './filter';

export const PersonsTable = ({
  formOfAddress,
}: {
  formOfAddress: FormOfAddress;
}) => {
  const [filter, setFilter] = useState<LoadPersonsFilter>({
    lastname: '',
    firstname: '',
    class: '',
    typeStudent: false,
    typeTeacher: false,
    typeParent: false,
    typeAdmin: false,
    typeOther: false,
  });

  return (
    <>
      <PersonsTableFilter setFilter={setFilter} />
      <PersonsTableContent formOfAddress={formOfAddress} filter={filter} />
    </>
  );
};
