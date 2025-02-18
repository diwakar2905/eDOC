import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState("Sign Up");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (state === "Sign Up") {
      axios
        .post(backendUrl + "/register", {
          name,
          email,
          password,
        })
        .then((data) => {
          if (data.status == 201) {
            toast.success("Registered Successfully");

            setState("login");
          }
        })
        .catch((error) => {
          switch (error.response.status) {
            case 403:
              toast.error("Email Already Registered, Try Logging In");
              break;
            case 404:
              toast.error("Account Not Found, Check And Retry.");
              break;
            case 500:
              toast.error("Internal Server Error, Try Again Later.");
              break;
          }
        });
    } else {
      axios
        .post(
          backendUrl + "/login",
          { email, password },
          { withCredentials: true }
        )
        .then((data) => {
          if (data.status == 200) {
            toast.success("Logged In Successfully");

            navigate("/my-appointments");
          }
        })
        .catch((error) => {
          console.log(error);
          switch (error.response.status) {
            case 401:
              toast.error("Incorrect Password, Check And Retry");
              break;
            case 404:
              toast.error("Account Not Found, Check And Retry.");
              break;
            case 500:
              toast.error("Internal Server Error, Try Again Later.");
              break;
          }
        });
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>
        <p>
          Please {state === "Sign Up" ? "sign up" : "log in"} to book
          appointment
        </p>
        {state === "Sign Up" ? (
          <div className="w-full ">
            <p>Full Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="border border-[#DADADA] rounded w-full p-2 mt-1"
              type="text"
              required
            />
          </div>
        ) : null}
        <div className="w-full ">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            required
          />
        </div>
        <div className="w-full ">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="password"
            required
          />
        </div>
        <button className="bg-primary text-white w-full py-2 my-2 rounded-md text-base">
          {state === "Sign Up" ? "Create account" : "Login"}
        </button>
        {state === "Sign Up" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-primary underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create an new account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-primary underline cursor-pointer"
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
