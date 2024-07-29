import React from "react";
import "./Login.scss";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { KEY_ACCESS_TOKEN, setItem } from "../../utils/localStorageManager";
import { axiosClient } from "../../utils/axiosClient";

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();

  const submitHandler = async (data) => {
    try {
      const response = await  axiosClient.post("/auth/login", {
        email: data.email,
        password: data.password,
      });
      navigate("/");
      setItem(KEY_ACCESS_TOKEN, response.data.result.acesstoken);
      reset();
    } catch (error) {
      console.error("Error in login", error);
    }
  };
  return (
    <div className="login">
      <div className="login-box">
        <h1 className="heading">Login</h1>
        <form onSubmit={handleSubmit((data) => submitHandler(data))}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="email"
            id="email"
            required
            {...register("email")}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="password"
            id="password"
            required
            {...register("password")}
          />

          <input type="submit" className="submit" />
        </form>
        <p>
          Don't have an account <Link to="/signup"> Sign-Up </Link>{" "}
        </p>
      </div>
    </div>
  );
};

export default Login;
