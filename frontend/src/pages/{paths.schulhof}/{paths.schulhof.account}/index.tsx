import { useT } from '@i18n';
import { Breadcrumbs } from '@UI/Breadcrumbs';
import { Col } from '@UI/Col';
import { Flex } from '@UI/Flex';
import { Heading } from '@UI/Heading';
import { Link } from '@UI/Link';
import { NextPage } from 'next';

const Page: NextPage = () => {
  const t = useT();
  // useRequireLogin();

  return (
    <Flex>
      <Col nr="1">
        <Breadcrumbs
          path={[t('paths.schulhof'), t('paths.schulhof.account')]}
        />
        <Heading size="1">
          {t('schulhof.account.title', {
            user_firstname: 'Jesper',
            user_lastname: 'Engberg',
          })}
        </Heading>
        <p>
          {t('schulhof.account.last-login', {
            last_login: new Date(),
            'theft-link': (c) => (
              <Link
                href={[
                  t('paths.schulhof'),
                  t('paths.schulhof.account'),
                  t('paths.schulhof.account.profile'),
                  t('paths.schulhof.account.profile.theft'),
                ]}
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
