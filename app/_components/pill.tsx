import Link from "next/link";
import Icon, { IconLable } from "./icon";
import { HTMLAttributes } from "react";
import { Url } from "url";

export interface PillProps extends HTMLAttributes<HTMLAnchorElement> {
  href: Url;
  leadingIcon?: IconLable;
  trailingIcon?: IconLable;
  children: any;
}

export default function Pill(props: PillProps): JSX.Element {
  const { href, className, leadingIcon, trailingIcon, children, ...rest } =
    props;

  const classNames = ["pill", className].join(" ");

  return (
    <Link href={href} className={classNames} {...rest}>
      {leadingIcon && <Icon label={leadingIcon} />}
      <p className="label">{children}</p>
      {trailingIcon && <Icon label={trailingIcon} />}
    </Link>
  );
}
