import { ReactNode } from "react";
import Header from "@/components/Header";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Header - fixed at top */}
      <Header />

      {/* Page content - with top padding for fixed header */}
      <main className="pt-24 pb-6 sm:pb-8">
        <div className="px-[50px] sm:px-[60px] lg:px-[80px]">{children}</div>
        </main>
    </div>
  );
};

export default MainLayout;

