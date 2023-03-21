import { Alert } from '#/ui/Alert';
import { Heading } from '#/ui/Heading';

export default function Page() {
  return (
    <>
      <Alert variant="success">
        <Heading size="4">Seite nicht gefunden</Heading>
        <p>
          Die gesuchte Seite existiert nicht oder nicht mehr. Das kann mehrere
          Gründe haben:
        </p>
        <ul>
          <li>Der verwendete Link ist veraltet.</li>
          <li>Im Link liegt ein Tippfehler vor.</li>
        </ul>
      </Alert>
      <Alert variant="warning">
        <Heading size="4">Seite nicht gefunden</Heading>
        <p>
          Die gesuchte Seite existiert nicht oder nicht mehr. Das kann mehrere
          Gründe haben:
        </p>
        <ul>
          <li>Der verwendete Link ist veraltet.</li>
          <li>Im Link liegt ein Tippfehler vor.</li>
        </ul>
      </Alert>
      <Alert variant="error">
        <Heading size="4">Seite nicht gefunden</Heading>
        <p>
          Die gesuchte Seite existiert nicht oder nicht mehr. Das kann mehrere
          Gründe haben:
        </p>
        <ul>
          <li>Der verwendete Link ist veraltet.</li>
          <li>Im Link liegt ein Tippfehler vor.</li>
        </ul>
      </Alert>
      <Alert variant="information">
        <Heading size="4">Seite nicht gefunden</Heading>
        <p>
          Die gesuchte Seite existiert nicht oder nicht mehr. Das kann mehrere
          Gründe haben:
        </p>
        <ul>
          <li>Der verwendete Link ist veraltet.</li>
          <li>Im Link liegt ein Tippfehler vor.</li>
        </ul>
      </Alert>
      <Alert variant="default">
        <Heading size="4">Seite nicht gefunden</Heading>
        <p>
          Die gesuchte Seite existiert nicht oder nicht mehr. Das kann mehrere
          Gründe haben:
        </p>
        <ul>
          <li>Der verwendete Link ist veraltet.</li>
          <li>Im Link liegt ein Tippfehler vor.</li>
        </ul>
      </Alert>
    </>
  );
}
