import { Roboto } from 'next/font/google';
import { createGlobalStyle } from 'styled-components';

const roboto = Roboto({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
});


export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    line-height: 1.2em;
  }

  html,
  body {
    padding: 0;
    margin: 0;
  }

  body {
    background-color: ${({ theme }) => theme.backgroundColor};
  }

  body, button, input, optgroup, select, textarea {
    font-family: ${roboto.style.fontFamily};
    font-size: ${({ theme }) => theme.fontSizes.regular};
    color: ${({ theme }) => theme.colors.text};
  }

  a {
    text-decoration: none;
  }

  p, ul, li {
    & {
      margin-top:7px;
      margin-bottom: 7px;
    }
    &:first-child {
      margin-top: 0;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }

  ul {
    padding: 0;
  }

  ul > li {
    margin-left: 20px;
    list-style-type: square;
  }
`;
