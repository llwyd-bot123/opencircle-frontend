import { lazy } from "react";

/**
 * Lazy-loaded components for application routes
 * Using React.lazy for code-splitting to improve initial load performance
 */

// Landing page components
export const LandingPage = lazy(() => import("../../pages/Landing"));

// Authentication components
export const LoginPage = lazy(() => import("../../pages/auth/Login"));
export const SignUpMemberPage = lazy(() => import("../../pages/auth/SignUpMember"));
export const SignUpOrgPage = lazy(() => import("../../pages/auth/SignUpOrg"));

// Organization-specific components
export const OrganizationProfilePage = lazy(
  () => import("../../pages/main/organization/OrganizationProfile")
);
export const OrganizationMemberPage = lazy(
  () => import("../../pages/main/organization/OrganizationMember")
);

// Member-specific components
export const MemberProfilePage = lazy(
  () => import("../../pages/main/member/MemberProfile")
);
export const MemberOrganizationPage = lazy(
  () => import("../../pages/main/member/MemberOrganization")
);

// Main application components
export const HomePage = lazy(() => import("../../pages/Home"));

// Error handling and utility components
export const NotFoundPage = lazy(() => import("./NotFound"));
export const PreloaderComponent = lazy(() => import("./Preloader"));
