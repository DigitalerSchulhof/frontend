'use client';

import { ButtonGroup } from '#/ui/Button';
import { Label } from '#/ui/Form';
import { Heading } from '#/ui/Heading';
import { TextInput, ToggleButton } from '#/ui/Input';
import { Table, TableCell, TableHeader, TableRow } from '#/ui/Table';
import { Suspense, useEffect, useId, useMemo, useState } from 'react';
import { Person, loadPersons } from './action';

export default function FilterTable() {
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

  const filterPart = useMemo(
    () => (
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
                t={'generic.person-types.student'}
                onChange={setTypeStudent}
              />
              <ToggleButton
                t={'generic.person-types.teacher'}
                onChange={setTypeTeacher}
              />
              <ToggleButton
                t={'generic.person-types.parent'}
                onChange={setTypeParent}
              />
              <ToggleButton
                t={'generic.person-types.admin'}
                onChange={setTypeAdmin}
              />
              <ToggleButton
                t={'generic.person-types.other'}
                onChange={setTypeOther}
              />
            </ButtonGroup>
          </TableCell>
        </TableRow>
      </Table>
    ),
    [
      lastnameId,
      firstnameId,
      classId,
      setLastname,
      setFirstname,
      setClass,
      setTypeStudent,
      setTypeTeacher,
      setTypeParent,
      setTypeAdmin,
      setTypeOther,
    ]
  );

  return (
    <>
      {filterPart}
      <Suspense fallback='LÄDT'>
        <ContentTable
          lastname={lastname}
          firstname={firstname}
          clazz={clazz}
          typeStudent={typeStudent}
          typeTeacher={typeTeacher}
          typeParent={typeParent}
          typeAdmin={typeAdmin}
          typeOther={typeOther}
        />
      </Suspense>
    </>
  );
}

function ContentTable({
  lastname,
  firstname,
  clazz,
  typeStudent,
  typeTeacher,
  typeParent,
  typeAdmin,
  typeOther,
}: {
  lastname: string;
  firstname: string;
  clazz: string;
  typeStudent: boolean;
  typeTeacher: boolean;
  typeParent: boolean;
  typeAdmin: boolean;
  typeOther: boolean;
}) {
  const [loading, setLoading] = useState(true);
  const [persons, setPersons] = useState<Person[] | null>(null);

  useEffect(() => {
    let unmounted = false as boolean;

    void (async () => {
      setLoading(true);
      const newPersons = await loadPersons({
        lastname,
        firstname,
        class: clazz,
        typeStudent,
        typeTeacher,
        typeParent,
        typeAdmin,
        typeOther,
      });

      if (unmounted) return;
      setLoading(false);
      setPersons(newPersons);
    })();

    return () => {
      unmounted = true;
    };
  }, [
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
    <>
      <Heading
        size='2'
        t='schulhof.administration.sections.persons.page.table.title'
      />
      <Table columns={4}>
        <TableRow>
          <TableHeader
            style={{ gridColumnStart: 2 }}
            t='schulhof.administration.sections.persons.page.table.columns.firstname'
          />
          <TableHeader t='schulhof.administration.sections.persons.page.table.columns.lastname' />
        </TableRow>
      </Table>
    </>
  );
}
