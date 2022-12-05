import * as classNames from "classnames";
import * as React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
  variant: 'default' | 'success' | 'danger' | 'error';
}

export const Button: React.FC<ButtonProps> = React.memo(function Button({
  children,
  variant,
  ...props
}) {
  const variantClass = {
    default: "",
    success: styles.success,

  }

  return <button className={classNames(styles.base, variantClass)} {...props} />;
});
