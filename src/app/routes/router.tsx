// src/router/index.tsx (or wherever your router file is)
import { createBrowserRouter } from "react-router-dom";
import type { RoleName } from "@src/features/auth/schema/auth.types";
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
} from "./lazyComponents";
import LandingLayout from "@src/layouts/LandingLayout";
import AuthLayout from "@src/layouts/AuthLayout";
import MainLayout from "@src/layouts/MainLayout";
import { ProtectedRoute } from "./ProtectedRoute";

export const router = createBrowserRouter([
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
  {
    element: <MainLayout />,
    children: [
      // Protected routes with role-based access control
      {
        element: <ProtectedRoute />,
        children: [
          // Route accessible to both organization and member roles
          {
            path: "home",
            element: <HomePage />,
          },

          // Organization routes - organization-profile/:id is accessible to members too
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

          // Organization profile route with ID parameter - accessible to both roles
          {
            path: "organization/:organizationId",
            element: <OrganizationProfilePage />,
          },

          // Member routes - only accessible to member role
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
]);
