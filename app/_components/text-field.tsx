import { useState, ChangeEvent } from "react";
import Styles from "./text-field.module.css";

interface TextFieldProps {
  leadingIcon?: JSX.Element;
  trailingIcon?: JSX.Element;
  label?: string;
  error?: string;
  defaultValue?: string;
  className?: string;
  children: JSX.Element;
}

export default function TextField(props: TextFieldProps) {
  let { leadingIcon, trailingIcon, label, className, children, error } = props;
  if (error) className = "danger";
  /**
   * When user starts typing @var span.label should be invisible
   * therefore here div.container is monitored for changes
   */

  let [inputValue, setInputValue] = useState(children.props.defaultValue);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }

  let showLabel = false;
  if (typeof inputValue == "string" && inputValue.length == 0) {
    showLabel = true;
  } else if (typeof inputValue == "undefined" && !children.props.defaultValue) {
    showLabel = true;
  }

  /**
   * configures size and style of `IconButton`(s) based on
   * `TextFieldProps`
   *
   * @param icon - Leading or trailing IconButton
   * @returns a clone of `IconButton` with `newProps`
   */

  const classNames = ["txt-field", className].join(" ");

  return (
    <div style={{ width: "100%" }}>
      <div onChange={handleChange} className={classNames}>
        <label htmlFor={children.props.id}>
          <p style={{ display: "none" }}>{label}</p>
          {children}
        </label>
        <div className="wrapper">
          {leadingIcon}
          <span className="label">{showLabel ? label : ""}</span>
          {trailingIcon}
        </div>
      </div>
      {error && <div className="textfield-error-msg">{error}</div>}
    </div>
  );
}
