import { Dispatch, SetStateAction, HTMLAttributes } from "react";

export enum InputType {
  EMAIL = "email",
  PASSWORD = "password",
  USERNAME = "username",
  TEXT = "text",
}

type InputProps = {
  type: InputType;
  title: string;
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
  validate?: boolean;
  iconLeft?: string;
};

const input = ({
  type,
  title,
  value,
  onChange,
  iconLeft = null,
  validate = false,
}: InputProps) => {
  return (
    <div className="field">
      <label className="label">{title}</label>
      <div className="control has-icons-left ">
        <input
          className="input"
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {iconLeft ? (
          <span className="icon is-small is-left">
            <ion-icon name={iconLeft}></ion-icon>
          </span>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default input;
