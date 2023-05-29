import '@total-typescript/ts-reset';

// Modified from https://stackoverflow.com/a/58473012/12405307
declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/ban-types
  function forwardRef<T, P = {}>(
    render: (props: P, ref: ForwardedRef<T>) => ReactElement | null
  ): (props: Omit<P, 'ref'> & RefAttributes<T>) => ReactElement | null;
}
