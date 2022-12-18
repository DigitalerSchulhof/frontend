import { Roboto } from '@next/font/google';
import 'styled-components';
import { createGlobalStyle } from 'styled-components';

const roboto = Roboto({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
});

export interface Accents {
  [K: string]: {
    regular: {
      background: string;
      text: string;
    };
    hover: {
      background: string;
      text: string;
    };
  };
}

export const theme = {
  backgroundColor: '#212121',
  fontSizes: {
    regular: '13px',
    small: '80%',
    h1: '170%',
    h2: '140%',
    h3: '120%',
    h4: '100%',
  },
  colors: {
    text: '#fcf8e3',
    textLink: '#3299cc',
    textMuted: '#ffffffb0',
  },
  accents: {
    success: {
      regular: {
        background: '#689f38',
        text: '#fcf8e3',
      },
      hover: {
        background: '#aed581',
        text: '#424242',
      },
    },
    warning: {
      regular: {
        background: '#ffa000',
        text: '#fcf8e3',
      },
      hover: {
        background: '#ffd54f',
        text: '#242424',
      },
    },
    error: {
      regular: {
        background: '#e64a19',
        text: '#fcf8e3',
      },
      hover: {
        background: '#ff8a65',
        text: '#242424',
      },
    },
    default: {
      regular: {
        background: '#424242',
        text: '#fcf8e3',
      },
      hover: {
        background: '#555555',
        text: '#242424',
      },
    },
  } satisfies Accents,
};

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

  p {
    margin-top: 0;
    margin-bottom: 7px;
  }
`;

export type Theme = typeof theme;
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
