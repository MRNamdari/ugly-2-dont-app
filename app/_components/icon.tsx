import * as FeatherIcon from "react-feather";

// Declaring IFeatherIcon type to have "react-feather" namespace as a type
declare type IFeatherIcon = typeof import("react-feather");

// Mapping all properties in the IFeatherIcon as keys with boolean values.
// boolean values are default values when nothing is assgined in a key-value
// pair in JSX/TSX.
type MapProps<Type> = {
  [Property in keyof Type as Exclude<Property, "IconProps" | "Icon">]?: boolean;
};

export type IconLable = keyof MapProps<IFeatherIcon>;
// IconProps extends Mapped Properites of IFeatherIcon and adds original
// "react-feather.IconProps" to it.
export interface IconProps extends FeatherIcon.IconProps {
  label: IconLable;
}

// "Icon" components is a simple feather-icon component that receives
// one additional prop "label" and returns the coresponding icon.
// this way making reusable form input components is easier.
export default function Icon({
  label,
  className,
  ...props
}: IconProps): JSX.Element {
  let SpecifiedIcon = FeatherIcon[label];
  return (
    <div
      className={`flex justify-center items-center aspect-square ${className ?? ""}`}
    >
      <SpecifiedIcon {...props} />
    </div>
  );
}
