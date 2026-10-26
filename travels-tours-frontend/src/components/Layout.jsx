import React from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";

function Layout({ children }) {
  return (
    <>
      <NavBar />
      <main className="container mt-4">
        {children}
      </main>
      <Footer />
    </>
  );
}

export default Layout;
