import Icon, { IconLable } from "./icon";
import React, {
  useRef,
  useState,
  MouseEvent,
  MouseEventHandler,
  useEffect,
} from "react";
import { motion } from "framer-motion";

export type MenuOption = { name?: string; value?: string };

export type MenuProps<T extends MenuOption> = {
  className?: string;
  label?: string;
  leadingIcon?: IconLable;
  name?: string;
  defaultValue?: T;
  children?: React.ReactNode;
  expanded?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};
/**
 * @example <Menu
          className="menu-lg active:menu-zinc-200 menu-zinc-100 "
          label="Select an Item"
          leadingIcon="Folder"
        ></Menu>
 */
export default function Menu<T extends MenuOption>(props: MenuProps<T>) {
  const [expanded, setExpansion] = useState<boolean>(props.expanded ?? false); // is closed by default
  const [label, setLabel] = useState<string | null>(
    props.defaultValue?.name ?? null,
  );

  const [value, setValue] = useState<string>(props.defaultValue?.value ?? "");

  useEffect(() => {
    setLabel(props.defaultValue?.name ?? null);
    setValue(props.defaultValue?.value ?? "");
  }, [props.defaultValue]);

  function ExpansionHandler(e: MouseEvent<HTMLDivElement>) {
    // Checking if input[type=text] is clicked to dismiss the event
    if (!(e.target instanceof HTMLInputElement)) {
      // Checking if an `li` in `ol` is clicked
      if (
        e.target instanceof HTMLLIElement &&
        !e.target.ariaInvalid &&
        !e.target.ariaDisabled
      )
        // Label is set only if menu is not set to expanded by default
        props.expanded === undefined &&
          setLabel((e.target as HTMLElement).ariaLabel);
      if (expanded) {
        const newvalue = (e.target as HTMLElement).ariaValueText ?? value;
        setValue(newvalue);
      }
      // Expansion is set only if menu is not set to expanded by default
      props.expanded === undefined && setExpansion(!expanded);
    }
  }
  function ClickHandler(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    // Expansion is set only if menu is not set to expanded by default
    if (!props.expanded) setExpansion(!expanded);
    if (props.onClick) props.onClick(e);
  }
  return (
    <div
      className={"menu " + props.className}
      aria-label={props.name}
      aria-expanded={expanded}
      onClick={ExpansionHandler}
    >
      <input type="hidden" name={props.name} defaultValue={value} />
      <motion.button
        whileTap={{ backgroundColor: "var(--fm-clr,inherit)" }}
        className="menu-button"
        aria-invalid
        onClick={ClickHandler}
      >
        {props.leadingIcon && <Icon label={props.leadingIcon} />}
        <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-left">
          {label ?? props.label}
        </p>
        {/* Icon is required only if menu is expandable */}
        {props.expanded === undefined && (
          <motion.span
            animate={expanded ? "open" : "closed"}
            variants={{ open: { rotate: 180 }, closed: { rotate: 0 } }}
          >
            <Icon label="ChevronDown" />
          </motion.span>
        )}
      </motion.button>
      <div aria-invalid className="menu-list-wrapper">
        <ol className="menu-list">{props.children}</ol>
      </div>
      {/* Overlay is required only if menu is expandable */}
      {props.expanded === undefined && (
        <div className={`overlay ${expanded ? "" : "hidden"}`}></div>
      )}
    </div>
  );
}

type MenuItemProps<V extends string> = {
  value: V;
  children: string;
  className: string;
  onSelect?: (item: MenuItemProps<V>["value"]) => any;
};
type MenuDisabledItemProps = {
  children: string;
  className: string;
};
type MenuSearchbarProps = {
  children: React.ReactNode;
  searchbar: true;
  className?: string;
};
/**
 * @returns an item to populate `Menu` component.
 * Item can be search-field to filter items, an selectable item or an disabled item.
 * @example <MenuItem
            className="menu-item-zinc-200 text-zinc-800"
            searchbar
          >
            <input
              type="text"
              className="..."
              onChange={(e) => {...}}
            />
          </MenuItem>
  @example <MenuItem
                className="menu-item-primary-700 hover:menu-item-primary-800 active:menu-item-primary-900 text-zinc-100"
                value={"value"}
                onSelect={(e) => {...}
              >
                {"name"}
            </MenuItem>
 */
export function MenuItem<T extends string>(
  props: MenuItemProps<T> | MenuDisabledItemProps | MenuSearchbarProps,
) {
  if ("value" in props)
    return (
      <motion.li
        aria-valuetext={props.value}
        aria-label={props.children}
        onClick={() => {
          if (props.onSelect) props.onSelect(props.value);
        }}
        className={
          "menu-item select-none focus:bg-[--fm-clr] " + props.className
        }
      >
        {props.children}
      </motion.li>
    );
  if ("searchbar" in props) {
    return (
      <li
        aria-disabled
        className={props.className + " menu-item sticky top-0 bg-inherit"}
      >
        {props.children}
      </li>
    );
  }
  return (
    <li aria-disabled className={"menu-item select-none " + props.className}>
      {props.children}
    </li>
  );
}
