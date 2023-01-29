import { useRequirePermission } from '@hooks/require-permission';
import { useT } from '@i18n';
import { Breadcrumbs } from '@UI/Breadcrumbs';
import { Col } from '@UI/Col';
import { Flex } from '@UI/Flex';
import { Heading } from '@UI/Heading';
import { NextPage } from 'next';
import { ELEMENTS } from '../../../administration';

const Page: NextPage = () => {
  const t = useT();

  return (
    <Flex>
      <Col nr="1">
        <Breadcrumbs
          path={[t('paths.schulhof'), t('paths.schulhof.administration')]}
        />
        <Heading size="1">{t('schulhof.administration.title')}</Heading>
        {ELEMENTS.map((element) => <element.Card key={element.ID } />)}
      </Col>
    </Flex>
  );
};

export default Page;
