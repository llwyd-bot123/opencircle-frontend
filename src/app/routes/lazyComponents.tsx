import { lazy } from "react";

// landing
export const LandingPage = lazy(() => import("../../pages/Landing"));

// auth
export const LoginPage = lazy(() => import("../../pages/auth/Login"));
export const SignUpMemberPage = lazy(
  () => import("../../pages/auth/SignUpMember")
);
export const SignUpOrgPage = lazy(() => import("../../pages/auth/SignUpOrg"));

// main
// organization
export const OrganizationProfilePage = lazy(
  () => import("../../pages/main/organization/OrganizationProfile")
);
export const OrganizationMemberPage = lazy(
  () => import("../../pages/main/organization/OrganizationMember")
);

// member
export const MemberProfilePage = lazy(
  () => import("../../pages/main/member/MemberProfile")
);
export const MemberOrganizationPage = lazy(
  () => import("../../pages/main/member/MemberOrganization")
);

// main home
export const HomePage = lazy(() => import("../../pages/Home"));
