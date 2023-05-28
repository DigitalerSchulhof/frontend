import { ButtonGroup } from '#/ui/Button';
import { Label } from '#/ui/Form';
import { TextInput, ToggleButton } from '#/ui/Input';
import { Table, TableCell, TableHeader, TableRow } from '#/ui/Table';
import { useEffect, useId, useState } from 'react';
import { LoadPersonsFilter } from '../action';

export const PersonsTableFilter = ({
  setFilter,
}: {
  setFilter: (value: LoadPersonsFilter) => void;
}) => {
  const [lastname, setLastname] = useState('');
  const [firstname, setFirstname] = useState('');
  const [clazz, setClass] = useState('');
  const [typeStudent, setTypeStudent] = useState(false);
  const [typeTeacher, setTypeTeacher] = useState(false);
  const [typeParent, setTypeParent] = useState(false);
  const [typeAdmin, setTypeAdmin] = useState(false);
  const [typeOther, setTypeOther] = useState(false);

  const lastnameId = useId();
  const firstnameId = useId();
  const classId = useId();

  useEffect(() => {
    setFilter({
      lastname,
      firstname,
      class: clazz,
      typeStudent,
      typeTeacher,
      typeParent,
      typeAdmin,
      typeOther,
    });
  }, [
    setFilter,
    lastname,
    firstname,
    clazz,
    typeStudent,
    typeTeacher,
    typeParent,
    typeAdmin,
    typeOther,
  ]);

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
              onChange={setTypeStudent}
            />
            <ToggleButton
              t={'generic.person-types.teacher.plural'}
              onChange={setTypeTeacher}
            />
            <ToggleButton
              t={'generic.person-types.parent.plural'}
              onChange={setTypeParent}
            />
            <ToggleButton
              t={'generic.person-types.admin.plural'}
              onChange={setTypeAdmin}
            />
            <ToggleButton
              t={'generic.person-types.other.plural'}
              onChange={setTypeOther}
            />
          </ButtonGroup>
        </TableCell>
      </TableRow>
    </Table>
  );
};
