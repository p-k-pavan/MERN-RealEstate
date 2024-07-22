import React from "react";
import { useSelector } from "react-redux";

export default function Profile() {

  const {currentUser} = useSelector(state => state.user);
  const handleChange = async () => {};

  const handleSubmite = async () => {};
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="font-semibold text-3xl text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmite}>
        <img className="w-24 h-24 cursor-pointer rounded-full mx-auto" src={currentUser.photo} alt=" profile" />
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg cursor-pointer"
          id="username"
          onChange={handleChange}
          value={currentUser.username}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg cursor-pointer"
          id="email"
          onChange={handleChange}
          value={currentUser.email}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg cursor-pointer"
          id="password"
          onChange={handleChange}
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg cursor-pointer uppercase hover:opacity-95 disabled:opacity-80">
          UPDATE
        </button>
        <button className="bg-green-700 text-white p-3 rounded-lg cursor-pointer uppercase hover:opacity-95 disabled:opacity-80">
          CREATE LISTING
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-600 cursor-pointer">Delete Account</span>
        <span className="text-red-600 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}
