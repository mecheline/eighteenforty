import { ReactNode } from "react";
import "./Label.css"

type LabelProps = {
  htmlFor: string;
  children: ReactNode;
};

const Label = ({ htmlFor, children }: LabelProps) => {
  return <label className="label" htmlFor={htmlFor}>{children}</label>;
};

export default Label;
