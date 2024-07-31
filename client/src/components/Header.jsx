import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link,useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm,setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`)
  };

  useEffect(()=>{
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl);
    }

  },[location.search])

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3 ">
        <h1 className="font-bold text-sm sm:text-xl flex flex-wrap cursor-pointer">
          <Link to="/">
            <span className="text-slate-500">PK </span>
            <span className="text-slate-700">Estate</span>
          </Link>
        </h1>
        <form onSubmit={handleSubmit} className="bg-slate-100 p-3 rounded-lg flex items-center cursor-pointer">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
          <FaSearch className="text-slate-600"></FaSearch>
          </button>
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline cursor-pointer hover:font-bold ">
              Home
            </li>
          </Link>
          <Link to="about">
            <li className="hidden sm:inline  text-slate-700 hover:underline cursor-pointer hover:font-bold">
              About
            </li>
          </Link>
          <Link to="/profile">
            <li className=" text-slate-700 hover:underline cursor-pointer hover:font-bold">
              {currentUser ? (
                <img className="w-7 h-7 rounded-full object-cover" src={currentUser.photo} alt="profile" />
              ) : (
                <li className="text-slate-700 hover:underline ">
                  Sign In
                </li>
              )}
            </li>
          </Link>
        </ul>
      </div>
    </header>
  );
}
