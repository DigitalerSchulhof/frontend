'use client';

import { Button } from '#/ui/Button';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { css, styled } from 'styled-components';

export const Header = () => {
  const router = useRouter();

  return (
    <HeaderWrapperOuter>
      <HeaderWrapper>
        <Button
          onClick={() => {
            Cookies.remove('jwt');
            router.refresh();
          }}
        >
          Abmelden
        </Button>
      </HeaderWrapper>
    </HeaderWrapperOuter>
  );
};

const HeaderWrapperOuter = styled.div(
  ({ theme }) => css`
    background-color: ${theme.backgroundColor};

    height: 82px;
    border-bottom: 1px solid #eaeaea;
  `
);

const HeaderWrapper = styled.header(
  ({ theme }) => css`
    margin: 0 auto;
    max-width: 1000px;
    padding: ${({ theme }) => theme.padding.medium} 0;
    width: 100%;

    display: grid;
    grid-template-columns: repeat(12, 1fr);
  `
);
