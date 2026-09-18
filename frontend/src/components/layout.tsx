import type { ReactNode } from "react";
import { Navbar } from "../common/navbar";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <Navbar />
      <main className="bg-gray-950 p-8">
        {children}
      </main>
    </div>
  );
}