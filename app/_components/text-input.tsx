export type TextInputProps = {
  error?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};
/**
 * A wrapper for `input[type="text"]`.
 * Necessary styles are configured in tailwind and available with `text-input-*` prefix.
 * @param props
 */
export default function TextInput(props: TextInputProps) {
  return (
    <div className="w-full">
      <div className={props.className}>{props.children}</div>
      {props.error}
    </div>
  );
}
