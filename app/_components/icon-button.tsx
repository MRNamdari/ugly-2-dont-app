import Icon, { IconLable } from "./icon";
import { motion, HTMLMotionProps } from "framer-motion";
export interface IconButtonProps extends HTMLMotionProps<"a"> {
  icon: IconLable;
}

export default function IconButton(props: IconButtonProps) {
  const { icon, ...rest } = props;
  const whileTap = {
    scale: 0.9,
    backgroundColor: "var(--fm-clr,transparent)",
  };

  return (
    <motion.a whileTap={whileTap} {...rest}>
      <Icon label={icon} />
    </motion.a>
  );
}
