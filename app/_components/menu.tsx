import Icon, { IconLable } from "./icon";
import React, { useState } from "react";
import { motion } from "framer-motion";

export type MenuOption = { name: string; value: any };

export type MenuProps = {
  className?: string;
  label?: string;
  leadingIcon?: IconLable;
  children?: React.ReactNode;
};
/**
 * @example <Menu
          className="menu-lg active:menu-zinc-200 menu-zinc-100 "
          label="Select an Item"
          leadingIcon="Folder"
        ></Menu>
 */
export default function Menu(props: MenuProps) {
  const [expanded, setExpansion] = useState<boolean>(false); // is closed
  const [value, setValue] = useState<string | null>(null);
  function ExpansionHandler(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    // Checking if input[type=text] is clicked to dismiss the event
    if (!(e.target instanceof HTMLInputElement)) {
      // Checking if an `li` in `ol` is clicked
      if (
        e.target instanceof HTMLLIElement &&
        !e.target.ariaInvalid &&
        !e.target.ariaDisabled
      )
        setValue((e.target as HTMLElement).ariaValueText);
      setExpansion(!expanded);
    }
  }
  function ClickHandler() {
    setExpansion(!expanded);
  }
  return (
    <div
      className={"menu " + props.className}
      aria-expanded={expanded}
      onClick={ExpansionHandler}
    >
      <motion.button
        whileTap={{ backgroundColor: "var(--fm-clr,inherit)" }}
        className="menu-button"
        aria-invalid
        onClick={ClickHandler}
      >
        {props.leadingIcon && <Icon label={props.leadingIcon}></Icon>}
        <p className="w-full text-left">{value ?? props.label}</p>
        <motion.span
          animate={expanded ? "open" : "closed"}
          variants={{ open: { rotate: 180 }, closed: { rotate: 0 } }}
        >
          <Icon label="ChevronDown" />
        </motion.span>
      </motion.button>
      <div aria-invalid className="menu-list-wrapper">
        <ol className="menu-list">{props.children}</ol>
      </div>
      <div className={`overlay ${expanded ? "" : "hidden"}`}></div>
    </div>
  );
}

type MenuItemProps = {
  value: string;
  children: string;
  className: string;
  onSelect: (item: MenuItemProps["value"]) => any;
};
type MenuDisabledItemProps = {
  children: string;
  className: string;
};
type MenuSearchbarProps = {
  children: React.ReactNode;
  searchbar: true;
  className: string;
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
export function MenuItem(
  props: MenuItemProps | MenuDisabledItemProps | MenuSearchbarProps
) {
  if ("value" in props)
    return (
      <motion.li
        whileTap={{ backgroundColor: "var(--fm-clr,inherit)" }}
        aria-valuetext={props.children}
        aria-label={props.children}
        onClick={() => props.onSelect(props.value)}
        className={"menu-item " + props.className}
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
    <li aria-disabled className={"menu-item " + props.className}>
      {props.children}
    </li>
  );
}
