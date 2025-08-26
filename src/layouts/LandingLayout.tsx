import { Navbar } from "@src/shared/components/NavbarComponent";
import ScrollToTop from "@src/shared/components/ScrollToTop";
import { Outlet, useNavigate } from "react-router-dom";

export default function LandingLayout() {
  const redirect = useNavigate();
  return (
    <div className="w-full min-h-screen bg-herobg overflow-x-hidden flex flex-col ">
      <Navbar
        brandName="OpenCircle"
        transparent={true}
        onButtonClick={() => redirect("/login")}
        buttonLabel="Log in"
      />
      <main className="flex-1 ">
        <ScrollToTop />
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
}
