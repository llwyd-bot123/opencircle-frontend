/**
 * Application routing configuration
 * Defines all routes and their access control requirements
 */
import { createBrowserRouter } from "react-router-dom";
import type { RoleName } from "@src/features/auth/schema/auth.types";

// Lazy-loaded page components
import {
  LandingPage,
  LoginPage,
  MemberOrganizationPage,
  MemberProfilePage,
  HomePage,
  OrganizationMemberPage,
  OrganizationProfilePage,
  SignUpMemberPage,
  SignUpOrgPage,
  NotFoundPage,
} from "./lazyComponents";

// Layout components
import LandingLayout from "@src/layouts/LandingLayout";
import AuthLayout from "@src/layouts/AuthLayout";
import MainLayout from "@src/layouts/MainLayout";

// Route protection component
import { ProtectedRoute } from "./ProtectedRoute";

/**
 * Router configuration with role-based access control
 */
export const router = createBrowserRouter([
  // Public landing routes
  {
    path: "/",
    element: <LandingLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
    ],
  },
  
  // Authentication routes
  {
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup-member",
        element: <SignUpMemberPage />,
      },
      {
        path: "signup-org",
        element: <SignUpOrgPage />,
      },
    ],
  },
  
  // Protected application routes
  {
    element: <MainLayout />,
    children: [
      {
        element: <ProtectedRoute />, // Requires authentication
        children: [
          // Common routes (accessible to all authenticated users)
          {
            path: "home",
            element: <HomePage />,
          },

          // Organization-specific routes
          {
            element: (
              <ProtectedRoute allowedRoles={["organization" as RoleName]} />
            ),
            children: [
              {
                path: "organization-profile",
                element: <OrganizationProfilePage />,
              },
              {
                path: "organization-member",
                element: <OrganizationMemberPage />,
              },
            ],
          },

          // Shared route with dynamic parameter
          {
            path: "organization/:organizationId",
            element: <OrganizationProfilePage />,
          },

          // Member-specific routes
          {
            element: <ProtectedRoute allowedRoles={["member" as RoleName]} />,
            children: [
              {
                path: "member-profile",
                element: <MemberProfilePage />,
              },
              {
                path: "member-organization",
                element: <MemberOrganizationPage />,
              },
            ],
          },
        ],
      },
    ],
  },
  
  // 404 Not Found route (catch-all)
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
