import { NextPage } from 'next';
import Link from 'next/link';
import { useT } from '../../i18n';
import { Breadcrumbs } from '../../ui/Breadcrumbs';
import { Col } from '../../ui/Col';
import { Flex } from '../../ui/Flex';
import { Heading } from '../../ui/Heading';

const Page: NextPage = () => {
  const t = useT();
  // @ts-ignore
  // useRequireLogin();

  return (
    <Flex>
      <Col nr="1">
        <Breadcrumbs
          path={[t('paths.schulhof'), t('paths.schulhof.account')]}
        />
        <Heading size="1">
          {t('schulhof.account.title', {
            user: {
              name: 'Jesper Engberg',
            },
          })}
        </Heading>
        <p>
          {t('schulhof.account.lastLogin', {
            lastLogin: new Date(),
            TheftLink: (c: string) => (
              <Link
                href={`/${t('paths.schulhof')}/${t(
                  'paths.schulhof.account'
                )}/${t('paths.schulhof.account.profile')}/${t(
                  'paths.schulhof.account.profile.theft'
                )}`}
              >
                {c}
              </Link>
            ),
          })}
        </p>
      </Col>
    </Flex>
  );
};

export default Page;
