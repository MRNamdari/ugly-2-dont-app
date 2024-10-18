import Link from "next/link";
import { motion } from "framer-motion";
import Icon from "./icon";
import { IconLable } from "./icon";

import { HTMLAttributes, forwardRef } from "react";
import { Url, UrlObject } from "url";
type NextLink = Partial<typeof Link>;
export interface ButtonProps
  extends NextLink,
    HTMLAttributes<HTMLAnchorElement> {
  href?: UrlObject | Url | string;
  leadingIcon?: IconLable;
  trailingIcon?: IconLable;
  disabled?: boolean;
}
export default forwardRef<HTMLElement, any>(function Button(
  props: ButtonProps,
  ref
): JSX.Element {
  const { children, leadingIcon, trailingIcon, className, disabled, ...rest } =
    props;
  const MotionLink: any = motion(Link);

  const whileTap = !disabled
    ? {
        backgroundColor: "var(--btn-bg-hov)",
        color: "var(--btn-txt-hov, var(--btn-txt))",
      }
    : {};

  return (
    <MotionLink ref={ref} href={props.href} whileTap={whileTap}>
      {leadingIcon ? <Icon label={leadingIcon} /> : null}
      {children}
      {trailingIcon ? <Icon label={trailingIcon} /> : null}
    </MotionLink>
  );
});
