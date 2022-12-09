import React from 'react';
import { Col } from '../Col';
import { Flex } from '../Flex';
import { Heading } from '../Heading';

export default function Page() {
  return (
    <Flex>
      <Col nr="1">
        <Heading size="2">Spalte 1</Heading>
      </Col>
      <Col nr="2">
        <Heading size="2">Spalte 2</Heading>
      </Col>
      <Col nr="2">
        <Heading size="2">Spalte 2</Heading>
      </Col>
      <Col nr="3">
        <Heading size="2">Spalte 3</Heading>
      </Col>
      <Col nr="3">
        <Heading size="2">Spalte 3</Heading>
      </Col>
      <Col nr="3">
        <Heading size="2">Spalte 3</Heading>
      </Col>
      <Col nr="4">
        <Heading size="2">Spalte 4</Heading>
      </Col>
      <Col nr="4">
        <Heading size="2">Spalte 4</Heading>
      </Col>
      <Col nr="4">
        <Heading size="2">Spalte 4</Heading>
      </Col>
      <Col nr="4">
        <Heading size="2">Spalte 4</Heading>
      </Col>
    </Flex>
  );
}
