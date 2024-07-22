import React, { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInstart,signInSuccess,signInFailure } from "../redux/user/userSlice.js";

export default function Signin() {

  const [formData, setFormData] = useState({});
  const {loading,error} = useSelector((state)=>state.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmite = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInstart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success == false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="font-semibold text-3xl text-center my-7">Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmite}>
        
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg cursor-pointer uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700">sign-up</span>
        </Link>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}
