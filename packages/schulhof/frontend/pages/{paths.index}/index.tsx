import { NextPage } from 'next';
import React from 'react';
import { useRequireLogin } from '../..';

const Page: NextPage = () => {
  useRequireLogin();

  return <>yO</>;
};

export default Page;
