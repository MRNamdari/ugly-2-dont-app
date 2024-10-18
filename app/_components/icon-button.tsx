import Icon, { IconLable } from "./icon";
import { motion, HTMLMotionProps } from "framer-motion";

export interface IconButtonProps extends HTMLMotionProps<"a"> {
  icon: IconLable;
}

export default function IconButton(props: IconButtonProps) {
  const { icon, ...rest } = props;
  const whileTap = {
    scale: 0.9,
    backgroundColor: "var(--btn-bg-hov)",
    color: "var(--btn-txt-hov, var(--btn-txt))",
  };

  return (
    <motion.a whileTap={whileTap} {...rest}>
      <Icon label={icon} />
    </motion.a>
  );
}
