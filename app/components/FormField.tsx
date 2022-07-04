import { memo, useEffect, useState } from "react";

interface FormFieldProps {
  htmlFor: string;
  label: string;
  type?: string;
  value: any;
  onChange: (...args: any) => any;
  errors?: string[];
}

const FormField: React.FC<FormFieldProps> = ({
  htmlFor,
  type,
  value,
  label,
  onChange,
  errors = [],
}) => {
  const [errorText, setErrorText] = useState<string | undefined>();
  useEffect(() => {
    if (errors.length > 0) {
      setErrorText(errors.join(","));
    }
  }, [errorText]);
  return (
    <>
      <label htmlFor={htmlFor} className="text-blue-600 font-semibold">
        {label}
      </label>
      <input
        onChange={(e) => {
          onChange(e);
          setErrorText("");
        }}
        type={type}
        id={htmlFor}
        name={htmlFor}
        className="w-full p-2 rounded-xl my-2"
        value={value}
      />
      <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">
        {errorText || ""}
      </div>
    </>
  );
};

export default memo(FormField);
