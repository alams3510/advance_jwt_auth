import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { apiRequest } from "../api/apiHelper";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      check: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Name is Required"),
      email: Yup.string()
        .matches(/^\S+@\S+\.\S+$/, "Please enter a valid email address")
        .required("Email field is Required"),
      password: Yup.string()
        .min(6, "Min six characters required")
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
          "Password must contain at least 6 characters, including letters and numbers"
        )
        .required("Password is Required"),
      check: Yup.boolean().required("Please Accept terms and condition"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await apiRequest.post("/user/register", values);
        if (response.data.success) {
          navigate("/login");
          resetForm();
        }
      } catch (error) {
        console.error(error);
      }
    },
  });
  return (
    <Card color="transparent" shadow={false}>
      <Typography variant="h4" color="blue-gray">
        Sign Up
      </Typography>
      <Typography color="gray" className="mt-1 font-normal">
        Nice to meet you! Enter your details to register.
      </Typography>
      <form
        className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 mx-auto"
        onSubmit={formik.handleSubmit}
      >
        <div className="mb-1 flex flex-col gap-3 items-start">
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Your Name
          </Typography>
          <Input
            size="lg"
            placeholder="name@mail.com"
            className={` ${
              formik.errors.username && formik.touched.username
                ? "!border-red-700"
                : "focus:!border-gray-700 !border-t-blue-gray-200"
            }`}
            labelProps={{
              className: "before:content-none after:content-none",
            }}
            type="text"
            name="username"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
          />
          {formik.errors.username && formik.touched.username ? (
            <div className="text-red-700 text-sm p-0 -mt-3 !border-t-red-900">
              {formik.errors.username}
            </div>
          ) : null}
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Your Email
          </Typography>
          <Input
            size="lg"
            placeholder="name@mail.com"
            className={` ${
              formik.errors.email && formik.touched.email
                ? "!border-red-700"
                : "focus:!border-gray-700 !border-t-blue-gray-200"
            }`}
            labelProps={{
              className: "before:content-none after:content-none",
            }}
            type="email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.errors.email && formik.touched.email ? (
            <div className="text-red-700 text-sm p-0 -mt-3">
              {formik.errors.email}
            </div>
          ) : null}
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Password
          </Typography>
          <Input
            type="password"
            size="lg"
            placeholder="********"
            className={` ${
              formik.errors.password && formik.touched.password
                ? "!border-red-700"
                : "focus:!border-gray-700 !border-t-blue-gray-200"
            }`}
            labelProps={{
              className: "before:content-none after:content-none",
            }}
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.errors.password && formik.touched.password ? (
            <div className="text-red-700 text-sm p-0 -mt-3">
              {formik.errors.password}
            </div>
          ) : null}
        </div>
        <Checkbox
          label={
            <Typography
              variant="small"
              color="gray"
              className="flex items-center font-normal"
            >
              I agree the
              <a
                href="#"
                className="font-medium transition-colors hover:text-gray-900"
              >
                &nbsp;Terms and Conditions
              </a>
            </Typography>
          }
          containerProps={{ className: "-ml-2.5" }}
          name="check"
          onChange={formik.handleChange}
          checked={formik.values.check}
          value={formik.values.check}
        />
        {formik.errors.check && formik.touched.check ? (
          <div className="text-red-700 text-sm p-0 -mt-1 text-center">
            {formik.errors.check}
          </div>
        ) : null}
        <Button
          className="mt-6"
          fullWidth
          type="submit"
          disabled={!formik.values.check}
        >
          sign up
        </Button>
        <Typography color="gray" className="mt-4 text-center font-normal">
          Already have an account?{" "}
          <Link to={"/login"} className="font-medium text-gray-900">
            Sign In
          </Link>
        </Typography>
      </form>
    </Card>
  );
}
