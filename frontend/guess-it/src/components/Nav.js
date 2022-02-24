import React from "react";

const Nav = () => {
  return (
    <nav
      className="
          w-full
          h-16
          bg-white
          absolute
          top-0
          flex
          items-center
          justify-between
          px-4
        "
    >
      <h1 className="logo font-bold">Guess It</h1>
      <ul className="social flex items-center justify-around">
        <li className="mx-2">facbook</li>
        <li className="mx-2">twitter</li>
      </ul>
    </nav>
  );
};

export default Nav;
