import Icon, { IconLable } from "./icon";
import { motion, HTMLMotionProps } from "framer-motion";

export type IconButtonProps = HTMLMotionProps<"button"> & {
  icon: IconLable;
};

export default function IconButton(props: IconButtonProps) {
  const { icon, ...rest } = props;
  const whileTap = {
    scale: 0.9,
    backgroundColor: "var(--fm-clr,transparent)",
  };

  return (
    <motion.button whileTap={whileTap} {...rest}>
      <Icon label={icon} />
    </motion.button>
  );
}
