'use client';

import { T } from '#/i18n';
import { Table } from '#/ui/Table';
import { useCallback, useState } from 'react';
import { PersonDetailsProps } from '.';
import { Button } from '#/ui/Button';
import { Note } from '#/ui/Note';

export type PersonDetailsTableProps = Pick<
  PersonDetailsProps,
  'person' | 'account'
> & {
  buttons?: React.ReactNode;
};

export const PersonDetailsTable = ({
  person,
  account,
  buttons,
}: PersonDetailsTableProps) => {
  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = useCallback(() => {
    setShowMore((s) => !s);
  }, [setShowMore]);

  return (
    <>
      <Table>
        <Table.Row>
          <Table.Header>
            <T t='schulhof.account.profile.data.table.type' />
          </Table.Header>
          <Table.Cell>
            <T t={`generic.person-type.${person.type}`} />
          </Table.Cell>
        </Table.Row>
        {account ? (
          <Table.Row>
            <Table.Header>
              <T t='schulhof.account.profile.data.table.username' />
            </Table.Header>
            <Table.Cell>{account.username}</Table.Cell>
          </Table.Row>
        ) : null}
        <Table.Row>
          <Table.Header>
            <T t='schulhof.account.profile.data.table.firstname' />
          </Table.Header>
          <Table.Cell>${person.firstname}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Header>
            <T t='schulhof.account.profile.data.table.lastname' />
          </Table.Header>
          <Table.Cell>${person.lastname}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Header>
            <T t='schulhof.account.profile.data.table.gender' />
          </Table.Header>
          <Table.Cell>
            <T t={`generic.gender.${person.gender}`} />
          </Table.Cell>
        </Table.Row>
        {account ? (
          <Table.Row>
            <Table.Header>
              <T t='schulhof.account.profile.data.table.email' />
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
                    <T t='schulhof.account.profile.data.table.last-login' />
                  </Table.Header>
                  <Table.Cell>
                    {account.lastLogin ? (
                      <T
                        t='generic.date.full'
                        args={{ date: new Date(account.lastLogin) }}
                      />
                    ) : (
                      <T t='schulhof.account.profile.data.table.no-login' />
                    )}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Header>
                    <T t='schulhof.account.profile.data.table.second-last-login' />
                  </Table.Header>
                  <Table.Cell>
                    {account.secondLastLogin ? (
                      <T
                        t='generic.date.full'
                        args={{ date: new Date(account.secondLastLogin) }}
                      />
                    ) : (
                      <T t='schulhof.account.profile.data.table.no-login' />
                    )}
                  </Table.Cell>
                </Table.Row>
              </>
            ) : null}
          </>
        ) : null}
      </Table>
      {!account ? (
        <Note>
          <T t='schulhof.account.profile.data.no-account' />
        </Note>
      ) : null}
      <p>
        <Button onClick={toggleShowMore}>
          <T t={showMore ? 'generic.less' : 'generic.more'} />
        </Button>
        {buttons}
      </p>
    </>
  );
};
