'use client';

import type { ClientFormOfAddress } from '#/utils/client';
import { useState } from 'react';
import type { LoadPersonsFilter } from './action';
import { PersonsTableContent } from './content';
import { PersonsTableFilter } from './filter';

export const PersonsTable = ({
  formOfAddress,
}: {
  formOfAddress: ClientFormOfAddress;
}) => {
  const [filter, setFilter] = useState<LoadPersonsFilter>({
    lastname: '',
    firstname: '',
    class: '',
    type: 0,
  });

  return (
    <>
      <PersonsTableFilter setFilter={setFilter} />
      <PersonsTableContent formOfAddress={formOfAddress} filter={filter} />
    </>
  );
};
