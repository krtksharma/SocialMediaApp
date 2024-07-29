import { Link, useNavigate } from "react-router-dom";
import "./SignUp.scss";
import React from "react";
import { useForm } from "react-hook-form";
import { axiosClient } from "../../utils/axiosClient";

const SignUp = () => {
  const { register, handleSubmit, reset } = useForm();
    const navigate = useNavigate();
  const submitHandler = async (data) => {
    try {
       const response = await axiosClient.post("/auth/signup", {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      console.log("SignUp successful", response.data);
      navigate("/login");
      reset();
    } catch (error) {
      console.error("Error in login", error);
    }
  };
  return (
    <div className="signup">
      <div className="signup-box">
        <h1 className="heading">SignUp</h1>
        <form onSubmit={handleSubmit((data) => submitHandler(data))}>
          <label htmlFor="name">Name</label>
          <input type="text" className="name" id="name" {...register('name')} required />

          <label htmlFor="email">Email</label>
          <input type="email" className="email" id="email" {...register('email')} required />

          <label htmlFor="password">Password</label>
          <input type="password" className="password" id="password" {...register('password')} required />

          <input type="submit" className="submit" />
        </form>
        <p>
          Already have an account <Link to="/login"> LogIn </Link>{" "}
        </p>
      </div>
    </div>
  );
};

export default SignUp;
