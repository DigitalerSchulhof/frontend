'use client';

import { T } from '#/i18n';
import { Button, ButtonGroup } from '#/ui/Button';
import { Note } from '#/ui/Note';
import { Table } from '#/ui/Table';
import { useCallback, useState } from 'react';
import { PersonDetailsProps } from '..';

export type PersonDetailsPersonalDataSectionTableProps = Pick<
  PersonDetailsProps,
  'person' | 'account'
> & {
  buttons?: React.ReactNode;
};

export const PersonDetailsPersonalDataSectionTable = ({
  person,
  account,
  buttons,
}: PersonDetailsPersonalDataSectionTableProps) => {
  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = useCallback(() => {
    setShowMore((s) => !s);
  }, [setShowMore]);

  return (
    <>
      <Table>
        <Table.Row>
          <Table.Header>
            <T t='schulhof.administration.sections.persons.slices.persons.details.personal-data.table.type' />
          </Table.Header>
          <Table.Cell>
            <T t={`generic.person-type.${person.type}`} />
          </Table.Cell>
        </Table.Row>
        {account ? (
          <Table.Row>
            <Table.Header>
              <T t='schulhof.administration.sections.persons.slices.persons.details.personal-data.table.username' />
            </Table.Header>
            <Table.Cell>{account.username}</Table.Cell>
          </Table.Row>
        ) : null}
        <Table.Row>
          <Table.Header>
            <T t='schulhof.administration.sections.persons.slices.persons.details.personal-data.table.firstname' />
          </Table.Header>
          <Table.Cell>{person.firstname}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Header>
            <T t='schulhof.administration.sections.persons.slices.persons.details.personal-data.table.lastname' />
          </Table.Header>
          <Table.Cell>{person.lastname}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Header>
            <T t='schulhof.administration.sections.persons.slices.persons.details.personal-data.table.gender' />
          </Table.Header>
          <Table.Cell>
            <T t={`generic.gender.${person.gender}`} />
          </Table.Cell>
        </Table.Row>
        {account ? (
          <Table.Row>
            <Table.Header>
              <T t='schulhof.administration.sections.persons.slices.persons.details.personal-data.table.email' />
            </Table.Header>
            <Table.Cell>{account.email}</Table.Cell>
          </Table.Row>
        ) : null}
        {showMore ? (
          <>
            {account ? (
              <>
                <Table.Row>
                  <Table.Header>
                    <T t='schulhof.administration.sections.persons.slices.persons.details.personal-data.table.last-login' />
                  </Table.Header>
                  <Table.Cell>
                    {account.lastLogin ? (
                      <T
                        t='generic.date.full'
                        args={{ date: new Date(account.lastLogin) }}
                      />
                    ) : (
                      <T t='schulhof.administration.sections.persons.slices.persons.details.personal-data.table.no-login' />
                    )}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Header>
                    <T t='schulhof.administration.sections.persons.slices.persons.details.personal-data.table.second-last-login' />
                  </Table.Header>
                  <Table.Cell>
                    {account.secondLastLogin ? (
                      <T
                        t='generic.date.full'
                        args={{ date: new Date(account.secondLastLogin) }}
                      />
                    ) : (
                      <T t='schulhof.administration.sections.persons.slices.persons.details.personal-data.table.no-login' />
                    )}
                  </Table.Cell>
                </Table.Row>
              </>
            ) : null}
          </>
        ) : null}
      </Table>
      {!account ? (
        <Note t='schulhof.administration.sections.persons.slices.persons.details.personal-data.no-account' />
      ) : null}
      <ButtonGroup>
        <Button
          onClick={toggleShowMore}
          t={showMore ? 'generic.less' : 'generic.more'}
        />
        {buttons}
      </ButtonGroup>
    </>
  );
};
