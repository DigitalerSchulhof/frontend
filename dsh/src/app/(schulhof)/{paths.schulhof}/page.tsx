import { getCurrentUser } from '#/auth/server';
import { Alert } from '#/ui/Alert';
import { Breadcrumbs } from '#/ui/Breadcrumbs';
import { Col } from '#/ui/Col';
import { Heading } from '#/ui/Heading';
import { Link } from '#/ui/Link';

export default async function Page() {
  const user = await getCurrentUser();

  return (
    <>
      <Col w='12'>
        <Breadcrumbs path={['paths.schulhof']} />
      </Col>
      {user ? null : (
        <Col w='12'>
          Gehe zur{' '}
          <Link href={['paths.schulhof', 'paths.schulhof.login']}>
            Anmeldung
          </Link>
          .
        </Col>
      )}
      <Col w='12'>
        <Alert variant='success'>
          <Heading size='3'>12</Heading>
          <p>Ich bin eine Box</p>
        </Alert>
      </Col>
      <Col w='6'>
        <Alert variant='warning'>
          <Heading size='3'>6</Heading>
          <p>Ich bin eine Box</p>
        </Alert>
      </Col>
      <Col w='6'>
        <Alert variant='warning'>
          <Heading size='3'>6</Heading>
          <p>Ich bin eine Box</p>
        </Alert>
      </Col>
      <Col w='4'>
        <Alert variant='error'>
          <Heading size='3'>4</Heading>
          <p>Ich bin eine Box</p>
        </Alert>
      </Col>
      <Col w='4'>
        <Alert variant='error'>
          <Heading size='3'>4</Heading>
          <p>Ich bin eine Box</p>
        </Alert>
      </Col>
      <Col w='4'>
        <Alert variant='error'>
          <Heading size='3'>4</Heading>
          <p>Ich bin eine Box</p>
        </Alert>
      </Col>
      <Col w='3'>
        <Alert variant='information'>
          <Heading size='3'>3</Heading>
          <p>Ich bin eine Box</p>
        </Alert>
      </Col>
      <Col w='3'>
        <Alert variant='information'>
          <Heading size='3'>3</Heading>
          <p>Ich bin eine Box</p>
        </Alert>
      </Col>
      <Col w='3'>
        <Alert variant='information'>
          <Heading size='3'>3</Heading>
          <p>Ich bin eine Box</p>
        </Alert>
      </Col>
      <Col w='3'>
        <Alert variant='information'>
          <Heading size='3'>3</Heading>
          <p>Ich bin eine Box</p>
        </Alert>
      </Col>
      <Col w='2'>
        <Alert variant='default'>
          <Heading size='3'>2</Heading>
          <p>Ich bin eine Box</p>
        </Alert>
      </Col>
      <Col w='2'>
        <Alert variant='default'>
          <Heading size='3'>2</Heading>
          <p>Ich bin eine Box</p>
        </Alert>
      </Col>
      <Col w='2'>
        <Alert variant='default'>
          <Heading size='3'>2</Heading>
          <p>Ich bin eine Box</p>
        </Alert>
      </Col>
      <Col w='2'>
        <Alert variant='default'>
          <Heading size='3'>2</Heading>
          <p>Ich bin eine Box</p>
        </Alert>
      </Col>
      <Col w='2'>
        <Alert variant='default'>
          <Heading size='3'>2</Heading>
          <p>Ich bin eine Box</p>
        </Alert>
      </Col>
      <Col w='2'>
        <Alert variant='default'>
          <Heading size='3'>2</Heading>
          <p>Ich bin eine Box</p>
        </Alert>
      </Col>
      <Col w='1'>
        <Alert variant='default'>
          <Heading size='3'>1</Heading>
          <p>Ja Box</p>
        </Alert>
      </Col>
      <Col w='1'>
        <Alert variant='default'>
          <Heading size='3'>1</Heading>
          <p>Ja Box</p>
        </Alert>
      </Col>
      <Col w='1'>
        <Alert variant='default'>
          <Heading size='3'>1</Heading>
          <p>Ja Box</p>
        </Alert>
      </Col>
      <Col w='1'>
        <Alert variant='default'>
          <Heading size='3'>1</Heading>
          <p>Ja Box</p>
        </Alert>
      </Col>
      <Col w='1'>
        <Alert variant='default'>
          <Heading size='3'>1</Heading>
          <p>Ja Box</p>
        </Alert>
      </Col>
      <Col w='1'>
        <Alert variant='default'>
          <Heading size='3'>1</Heading>
          <p>Ja Box</p>
        </Alert>
      </Col>
      <Col w='1'>
        <Alert variant='default'>
          <Heading size='3'>1</Heading>
          <p>Ja Box</p>
        </Alert>
      </Col>
      <Col w='1'>
        <Alert variant='default'>
          <Heading size='3'>1</Heading>
          <p>Ja Box</p>
        </Alert>
      </Col>
      <Col w='1'>
        <Alert variant='default'>
          <Heading size='3'>1</Heading>
          <p>Ja Box</p>
        </Alert>
      </Col>
      <Col w='1'>
        <Alert variant='default'>
          <Heading size='3'>1</Heading>
          <p>Ja Box</p>
        </Alert>
      </Col>
      <Col w='1'>
        <Alert variant='default'>
          <Heading size='3'>1</Heading>
          <p>Ja Box</p>
        </Alert>
      </Col>
      <Col w='1'>
        <Alert variant='default'>
          <Heading size='3'>1</Heading>
          <p>Ja Box</p>
        </Alert>
      </Col>
    </>
  );
}
