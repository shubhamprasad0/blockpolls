"use client";
import { ModeToggle } from "./mode-toggle";
import Logo from "./logo";

const Header = () => {
  return (
    <div className="w-screen py-4 px-8 border-b">
      <div className="flex justify-between items-center sm:pl-12 sm:pr-2">
        <Logo />
        <div className="flex justify-end gap-8">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};

export default Header;
