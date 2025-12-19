"use client";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 
      shadow-xl backdrop-blur-md bg-gradient-to-r from-purple-500 to-pink-400 ">
      
      <div className="mx-auto flex items-center justify-between px-6 py-3">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-3xl group-hover:rotate-12 transition-transform duration-300 drop-shadow-lg">
            📖✨
          </span>
          <span className="text-3xl font-extrabold text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]">
            Story <span className="text-yellow-200">Spark</span>
          </span>
        </Link>

        
        {/* MENU */}
        <div className="flex items-center gap-6 text-lg font-semibold">
          <Link href="/" className="text-white hover:text-yellow-200 transition">
            Home
          </Link>
          <Link href="/about" className="text-white hover:text-yellow-200 transition">
            About Us
          </Link>
          <Link href="/contact" className="text-white hover:text-yellow-200 transition">
            Contact
          </Link>

          <Link href="/login" className="text-white hover:text-yellow-200 transition font-bold">
            Login
          </Link>

          {/* SIGN UP Button */}
          <Link
            href="/signup"
            className="text-white hover:text-yellow-200 transition font-bold"
          >
            ✨ Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
