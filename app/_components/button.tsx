import Link from "next/link";
import { motion, HTMLMotionProps } from "framer-motion";
import Icon from "./icon";
import { IconLable } from "./icon";

import { forwardRef } from "react";
import { Url, UrlObject } from "url";
// type NextLink = Partial<typeof Link>;
export type ButtonProps = HTMLMotionProps<"a"> & {
  href?: UrlObject | Url | string;
  leadingIcon?: IconLable;
  trailingIcon?: IconLable;
  disabled?: boolean;
  children: React.ReactNode;
};
export default forwardRef<HTMLAnchorElement, ButtonProps>(function Button(
  props: ButtonProps,
  ref
): JSX.Element {
  const { children, leadingIcon, trailingIcon, className, disabled, ...rest } =
    props;
  const MotionLink = motion.create(Link);
  const whileTap = !disabled
    ? {
        scale: 0.9,
        backgroundColor: "var(--fm-clr)",
      }
    : {};

  return (
    <MotionLink
      ref={ref}
      href={props.href}
      whileTap={whileTap}
      className={className}
      aria-disabled={disabled}
      {...rest}
    >
      {leadingIcon ? <Icon label={leadingIcon} /> : null}
      {children}
      {trailingIcon ? <Icon label={trailingIcon} /> : null}
    </MotionLink>
  );
});
