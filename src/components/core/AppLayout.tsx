import React from "react";
import Sidebar from "./Sidebar";

const Applayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen w-full flex overflow-auto">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default Applayout;
