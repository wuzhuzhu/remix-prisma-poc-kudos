import { memo } from "react";
import type { ZodIssue } from "zod";

interface FormFieldProps {
  htmlFor: string;
  label: string;
  type?: string;
  value: any;
  onChange: (...args: any) => any;
  errors?: ZodIssue[];
}

const FormField: React.FC<FormFieldProps> = ({
  htmlFor,
  type,
  value,
  label,
  onChange,
}) => {
  return (
    <>
      <label htmlFor={htmlFor} className="text-blue-600 font-semibold">
        {label}
      </label>
      <input
        onChange={onChange}
        type={type}
        id={htmlFor}
        name={htmlFor}
        className="w-full p-2 rounded-xl my-2"
        value={value}
      />
    </>
  );
};

export default memo(FormField);
