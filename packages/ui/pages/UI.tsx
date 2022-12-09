import React from 'react';
import { Breadcrumbs } from '../Breadcrumbs';
import { Button } from '../Button';
import { Col } from '../Col';
import { Flex } from '../Flex';
import { Heading } from '../Heading';
import { Note } from '../Note';

export default function Page() {
  return (
    <Flex>
      <Col nr="1" style={{ border: '1px solid red' }}>
        Spalte 1
      </Col>
      <Col nr="2" style={{ border: '1px solid red' }}>
        Spalte 2
      </Col>
      <Col nr="2" style={{ border: '1px solid red' }}>
        Spalte 2
      </Col>
      <Col nr="3" style={{ border: '1px solid red' }}>
        Spalte 3
      </Col>
      <Col nr="3" style={{ border: '1px solid red' }}>
        Spalte 3
      </Col>
      <Col nr="3" style={{ border: '1px solid red' }}>
        Spalte 3
      </Col>
      <Col nr="4" style={{ border: '1px solid red' }}>
        Spalte 4
      </Col>
      <Col nr="4" style={{ border: '1px solid red' }}>
        Spalte 4
      </Col>
      <Col nr="4" style={{ border: '1px solid red' }}>
        Spalte 4
      </Col>
      <Col nr="4" style={{ border: '1px solid red' }}>
        Spalte 4
      </Col>
      <Col nr="2">
        <Breadcrumbs path={['Home', 'UI']} />
        <Heading size="1">UI</Heading>
      </Col>
      <Col nr="2">
        <Button variant="success">Yayy</Button>
        <Button variant="warning">Meh</Button>
        <Button variant="error">Nayy</Button>
        <Button variant="default">Default</Button>
        <Note>Buttonskis</Note>
        <Note>4 an der Zahl soweit</Note>
      </Col>
    </Flex>
  );
}
