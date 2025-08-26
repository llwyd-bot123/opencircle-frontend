import ScrollToTop from "@src/shared/components/ScrollToTop";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@src/shared/store";

export default function AuthLayout() {
  const { isAuthenticated, user } = useAuthStore();

  // If user is authenticated, redirect to appropriate home page based on role
  if (isAuthenticated && user) {
    const redirectPath = "/home";
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="w-full min-h-screen bg-authlayoutbg overflow-x-hidden ">
      <main className="flex-1 ">
        <ScrollToTop />
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
}
