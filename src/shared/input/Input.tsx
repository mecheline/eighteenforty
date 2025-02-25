import { ComponentPropsWithoutRef } from "react";
import "./Input.css";

type InputProps = {
  id: string;

  type: string;
} & ComponentPropsWithoutRef<"input">;

const Input = ({ id, type, ...rest }: InputProps) => {
  return <input className="input" type={type} id={id} {...rest} />;
};

export default Input;
