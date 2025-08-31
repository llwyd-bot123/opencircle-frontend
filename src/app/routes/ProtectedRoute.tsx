import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@src/shared/store";
import { RoleId } from "@src/features/auth/schema/auth.types";
import type { RoleName } from "@src/features/auth/schema/auth.types";

interface ProtectedRouteProps {
  /**
   * The roles allowed to access this route
   */
  allowedRoles?: RoleName[];
  /**
   * The path to redirect to if the user is not authenticated
   */
  redirectPath?: string;
}

/**
 * A wrapper component that protects routes based on authentication and role
 * @param allowedRoles - Array of roles that can access the route
 * @param redirectPath - Path to redirect to if access is denied
 */
export const ProtectedRoute = ({
  allowedRoles = [],
  redirectPath = "/login",
}: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If there are no role restrictions or if user's role is allowed, render the route
  if (allowedRoles.length === 0) {
    return <Outlet />;
  }

  // Check if user has a role_id and if it's allowed
  if (user?.role_id) {
    // Convert role_id to role name
    const roleName: RoleName =
      user.role_id === RoleId.Member ? "member" : "organization";

    // Check if the role name is in the allowed roles
    if (allowedRoles.includes(roleName)) {
      return <Outlet />;
    }
  }

  console.log("user data", user);

  // If user's role is not allowed, redirect to their appropriate home page based on role
  // At this point, we know user exists because we've already checked isAuthenticated
  // and we're in the block that checks user?.role_id
  const homePath = "/home";
  return <Navigate to={homePath} replace />;
};
