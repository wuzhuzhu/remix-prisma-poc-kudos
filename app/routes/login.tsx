import { memo, useEffect, useRef, useState } from "react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Layout } from "~/components/Layout";
import FormField from "~/components/FormField";
import { LoginValidator, RegisterValidator } from "~/utils/validator.server";
import type { LoginFormTYpe, RegisterFormType } from "~/utils/validator.server";
import type { SafeParseReturnType } from "zod";
import { json, redirect } from "@remix-run/node";
import { getUser, login, register, requireUserId } from "~/utils/auth.server";
import { useActionData } from "@remix-run/react";
import { effect } from "zod";

export const loader: LoaderFunction = async ({ request }) => {
  // If there's already a user in the session, redirect to the home page
  return (await getUser(request)) ? redirect("/") : null;
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const action = form.get("_action");
  const email = form.get("email");
  const password = form.get("password");
  let firstName = form.get("firstName");
  let lastName = form.get("lastName");

  let formInput = {
    email,
    password,
  };
  if (action === "register") {
    formInput = {
      ...formInput,
      firstName,
      lastName,
    } as RegisterFormType | LoginFormTYpe;
  }

  const Validator = action === "login" ? LoginValidator : RegisterValidator;

  console.log("validating forms: ", formInput);
  const { success, error, data } = Validator.safeParse(formInput);
  console.log("validated value: ", { success, error, data }, error?.issues);
  if (!success) {
    const issues = error?.issues || [];
    const errors = issues.reduce((prev, current, index, issues) => {
      const prevMsg = prev[current.path[0]] || [];
      const currentMsg = current.message;
      console.log({ index, key: current.path[0], currentMsg });
      return {
        ...prev,
        [current.path[0]]: [...prevMsg, currentMsg],
      };
    }, {});
    console.log("parsed err: ", { errors });
    return json({ errors, fields: formInput });
  }

  switch (action) {
    case "login": {
      return await login(formInput);
    }
    case "register": {
      return await register(formInput);
    }
  }
};

export default memo(function Login() {
  const [action, setAction] = useState("login");

  const actionData = useActionData();
  const firstLoad = useRef(true);
  const [errors, setErrors] = useState(actionData?.errors || []);

  console.assert(!!errors, { errors });
  const [formData, setFormData] = useState({
    email: actionData?.fields?.email || "",
    password: actionData?.fields?.password || "",
    firstName: actionData?.fields?.lastName || "",
    lastName: actionData?.fields?.firstName || "",
  });

  useEffect(() => {
    if (!firstLoad.current) {
      const newState = {
        email: "",
        password: "",
        firstName: "",
        lastName: "",
      };
      setErrors([]);
      setFormData(newState);
    }
  }, [action]);

  useEffect(() => {
    if (!firstLoad.current) {
      setErrors([]);
    }
  }, [formData]);

  useEffect(() => {
    firstLoad.current = false;
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((form) => ({
      ...form,
      [field]: e.target.value,
    }));
  };
  return (
    <Layout>
      <div className="h-full justify-center items-center flex flex-col gap-y-4 transition duration-300">
        <button
          onClick={() => setAction(action == "login" ? "register" : "login")}
          className="absolute top-8 right-8 rounded-xl bg-yellow-300 font-semibold text-blue-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
        >
          {action === "login" ? "Sign Up" : "Sign In"}
        </button>
        <h2 className="text-5xl font-extrabold text-yellow-300">
          Welcome to Kudos!
        </h2>
        <p className="font-semibold text-slate-300">
          {action === "login"
            ? "Log In To Give Some Praise!"
            : "Sign Up To Get Started!"}
        </p>

        <form method="post" className="rounded-2xl bg-gray-200 p-6 w-96">
          <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">
            {errors ? "sorry, some error" : ""}
          </div>
          <FormField
            label="Email"
            value={formData.email}
            errors={errors?.email}
            onChange={(e) => handleInputChange(e, "email")}
            htmlFor="email"
            type="text"
          />
          <FormField
            type="password"
            value={formData.password}
            errors={errors?.password}
            onChange={(e) => handleInputChange(e, "password")}
            htmlFor="password"
            label="Password"
          />
          {action === "register" && (
            <>
              <FormField
                htmlFor="firstName"
                label="First Name"
                onChange={(e) => handleInputChange(e, "firstName")}
                value={formData.firstName}
                errors={errors?.firstName}
              />
              <FormField
                htmlFor="lastName"
                label="Last Name"
                onChange={(e) => handleInputChange(e, "lastName")}
                value={formData.lastName}
                errors={errors?.lastName}
              />
            </>
          )}

          <div className="w-full text-center">
            <button
              type="submit"
              name="_action"
              value={action}
              className="rounded-xl mt-2 bg-yellow-300 px-3 py-2 text-blue-600 font-semibold transition durition-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
            >
              {action === "login" ? "Log In" : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
});
