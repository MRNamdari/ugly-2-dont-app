import { motion, HTMLMotionProps } from "framer-motion";
import Icon from "./icon";
import { IconLable } from "./icon";
import { forwardRef } from "react";

export type ButtonProps = HTMLMotionProps<"button"> & {
  leadingIcon?: IconLable;
  trailingIcon?: IconLable;
  disabled?: boolean;
  children: React.ReactNode;
};
export default forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  props: ButtonProps,
  ref
): JSX.Element {
  const { children, leadingIcon, trailingIcon, className, disabled, ...rest } =
    props;
  const whileTap = !disabled
    ? {
        scale: 0.9,
        backgroundColor: "var(--fm-clr)",
      }
    : {};

  return (
    <motion.button
      ref={ref}
      whileTap={whileTap}
      className={className + " select-none"}
      aria-disabled={disabled}
      {...rest}
    >
      {leadingIcon ? <Icon label={leadingIcon} /> : null}
      <p className="text-ellipsis overflow-hidden whitespace-nowrap">
        {children}
      </p>
      {trailingIcon ? <Icon label={trailingIcon} /> : null}
    </motion.button>
  );
});
