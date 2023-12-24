import { ButtonGroup } from '#/ui/Button';
import { Label } from '#/ui/Form';
import { TextInput, ToggleButton } from '#/ui/Input';
import { Table, TableCell, TableHeader, TableRow } from '#/ui/Table';
import { useEffect, useId, useState } from 'react';
import type { LoadPersonsFilter } from './action';
import { useBitState } from '#/utils/client';

export const PersonsTableFilter = ({
  setFilter,
}: {
  setFilter: (value: LoadPersonsFilter) => void;
}) => {
  const [lastname, setLastname] = useState('');
  const [firstname, setFirstname] = useState('');
  const [clazz, setClass] = useState('');
  const [type, createSetType] = useBitState(0);

  const lastnameId = useId();
  const firstnameId = useId();
  const classId = useId();

  useEffect(() => {
    setFilter({
      lastname,
      firstname,
      class: clazz,
      type,
    });
  }, [setFilter, lastname, firstname, clazz, type]);

  return (
    <Table columns={'1fr 1fr 1fr auto'} rows={2}>
      <TableRow>
        <TableHeader>
          <Label
            htmlFor={lastnameId}
            t='schulhof.administration.sections.persons.page.filter.lastname'
          />
        </TableHeader>
        <TableHeader>
          <Label
            htmlFor={firstnameId}
            t='schulhof.administration.sections.persons.page.filter.firstname'
          />
        </TableHeader>
        <TableHeader>
          <Label
            htmlFor={classId}
            t='schulhof.administration.sections.persons.page.filter.class'
          />
        </TableHeader>
        <TableHeader>
          <Label t='schulhof.administration.sections.persons.page.filter.type' />
        </TableHeader>
      </TableRow>
      <TableRow>
        <TableCell>
          <TextInput id={lastnameId} onInput={setLastname} />
        </TableCell>
        <TableCell>
          <TextInput id={firstnameId} onInput={setFirstname} />
        </TableCell>
        <TableCell>
          <TextInput id={classId} onInput={setClass} />
        </TableCell>
        <TableCell>
          <ButtonGroup>
            <ToggleButton
              t={'generic.person-types.student.plural'}
              onChange={createSetType(0)}
            />
            <ToggleButton
              t={'generic.person-types.teacher.plural'}
              onChange={createSetType(1)}
            />
            <ToggleButton
              t={'generic.person-types.parent.plural'}
              onChange={createSetType(2)}
            />
            <ToggleButton
              t={'generic.person-types.admin.plural'}
              onChange={createSetType(3)}
            />
            <ToggleButton
              t={'generic.person-types.other.plural'}
              onChange={createSetType(4)}
            />
          </ButtonGroup>
        </TableCell>
      </TableRow>
    </Table>
  );
};
