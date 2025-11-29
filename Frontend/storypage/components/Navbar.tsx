import React from "react";

const Navbar = () => {
  return (
    // Simple top-level banner to keep brand identity visible across screens
    <div className="bg-purple-700 w-full h-12">
      
      {/* Title placed in center to create a consistent anchor point for users */}
      <h1 className="text-2xl font-sans-serif text-center text-white m-1">
        Magic Story Book
      </h1>
    </div>
  );
};

export default Navbar;
