import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-slate-200 px-12 sm:px-20 py-4">
      <div className="flex justify-between">
        <h1 className="font-bold text-2xl">Dashboard</h1>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-md">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
