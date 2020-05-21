import {
  Dispatch,
  SetStateAction,
  HTMLAttributes,
  ChangeEvent,
  useState,
} from "react";
import { motion } from "framer-motion";
import PasswordCheck from "components/passwordCheck";

export enum InputType {
  EMAIL = "email",
  PASSWORD = "password",
  USERNAME = "username",
  TEXT = "text",
  DATE = "date",
}

type InputProps = {
  type?: InputType;
  title: string;
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
  passwordStrength?: boolean;
  iconLeft?: string;
  error?: string;
};

const input = ({
  type = InputType.TEXT,
  title,
  value,
  onChange,
  iconLeft = null,
  passwordStrength = false,
  error = "",
}: InputProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="field">
      <label className="label">{title}</label>
      <div className={"control " + (iconLeft ? "has-icons-left" : "")}>
        <input
          className={"input " + (error ? "is-danger" : "")}
          type={type}
          value={value}
          onChange={handleChange}
        />
        {iconLeft ? (
          <span className="icon is-small is-left">
            <ion-icon name={iconLeft}></ion-icon>
          </span>
        ) : (
          <></>
        )}

        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: value ? 1 : 0, height: value ? "auto" : 0 }}
          style={{ paddingTop: 5 }}
        >
          {passwordStrength && value ? (
            <PasswordCheck password={value} />
          ) : (
            <></>
          )}
        </motion.div>
      </div>
      {error ? <p className="help is-danger">{error}</p> : <></>}
    </div>
  );
};

export default input;
