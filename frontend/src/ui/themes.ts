import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}

export type Variant =
  | 'success'
  | 'warning'
  | 'error'
  | 'information'
  | 'default';

export interface Shared {
  pageWidth: string;
  fontSizes: {
    regular: string;
    small: string;
    h1: string;
    h2: string;
    h3: string;
    h4: string;
  };
}

export interface Theme extends Shared {
  backgroundColor: string;
  colors: {
    text: string;
    textLink: string;
    textLinkHover: string;
    textMuted: string;
  };
  accents: Record<
    Variant,
    {
      regular: {
        background: string;
        text: string;
      };
      hover: {
        background: string;
        text: string;
      };
    }
  >;
}

export const shared = {
  pageWidth: '1200px',
  fontSizes: {
    regular: '16px',
    small: '80%',
    h1: '170%',
    h2: '140%',
    h3: '120%',
    h4: '100%',
  },
} satisfies Shared;

export const themes = {
  light: {
    ...shared,
    backgroundColor: 'rgb(255, 255, 255)',
    colors: {
      text: 'rgb(0, 0, 0)',
      textLink: 'rgb(50, 153, 204)',
      textLinkHover: 'rgb(0, 153, 102)',
      textMuted: 'rgb(85, 85, 85)',
    },
    accents: {
      success: {
        regular: {
          background: 'rgb(199, 255, 119)',
          text: 'rgb(0, 0, 0)',
        },
        hover: {
          background: 'rgb(101, 173, 0)',
          text: 'rgb(255, 255, 255)',
        },
      },
      warning: {
        regular: {
          background: 'rgb(255, 217, 90)',
          text: 'rgb(0, 0, 0)',
        },
        hover: {
          background: 'rgb(209, 118, 0)',
          text: 'rgb(255, 255, 255)',
        },
      },
      error: {
        regular: {
          background: 'rgb(244, 148, 97)',
          text: 'rgb(0, 0, 0)',
        },
        hover: {
          background: 'rgb(202, 79, 12)',
          text: 'rgb(255, 255, 255)',
        },
      },
      information: {
        regular: {
          background: 'rgb(148, 209, 255)',
          text: 'rgb(0, 0, 0)',
        },
        hover: {
          background: 'rgb(51, 153, 204)',
          text: 'rgb(255, 255, 255)',
        },
      },
      default: {
        regular: {
          background: 'rgb(221, 221, 221)',
          text: 'rgb(0, 0, 0)',
        },
        hover: {
          background: 'rgb(170, 170, 170)',
          text: 'rgb(255, 255, 255)',
        },
      },
    },
  },
  dark: {
    ...shared,
    backgroundColor: 'rgb(33, 33, 33)',
    colors: {
      text: 'rgb(252, 248, 227)',
      textLink: 'rgb(50, 153, 204)',
      textLinkHover: 'rgb(0, 153, 102)',
      textMuted: 'rgba(255, 255, 255, 0.69)',
    },
    accents: {
      success: {
        regular: {
          background: 'rgb(104, 159, 56)',
          text: 'rgb(255, 255, 255)',
        },
        hover: {
          background: 'rgb(174, 213, 129)',
          text: 'rgb(0, 0, 0)',
        },
      },
      warning: {
        regular: {
          background: 'rgb(255, 160, 0)',
          text: 'rgb(255, 255, 255)',
        },
        hover: {
          background: 'rgb(255, 213, 79)',
          text: 'rgb(0, 0, 0)',
        },
      },
      error: {
        regular: {
          background: 'rgb(230, 74, 25)',
          text: 'rgb(255, 255, 255)',
        },
        hover: {
          background: 'rgb(255, 138, 101)',
          text: 'rgb(0, 0, 0)',
        },
      },
      information: {
        regular: {
          background: 'rgb(51, 153, 204)',
          text: 'rgb(255, 255, 255)',
        },
        hover: {
          background: 'rgb(148, 209, 255)',
          text: 'rgb(0, 0, 0)',
        },
      },
      default: {
        regular: {
          background: 'rgb(85, 85, 85)',
          text: 'rgb(255, 255, 255)',
        },
        hover: {
          background: 'rgb(66, 66, 66)',
          text: 'rgb(255, 255, 255)',
        },
      },
    },
  },
} satisfies Record<string, Theme>;
