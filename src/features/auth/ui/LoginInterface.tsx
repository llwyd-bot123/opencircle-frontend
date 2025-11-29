import { PrimaryButton } from "@src/shared/components/PrimaryButton";
import brandLogoDark from "@src/assets/brand-dark.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMemberLoginDeferred, useOrganizationLogin } from "../model";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../schema/auth.schema";
import type { MemberLoginResponse, OrganizationLoginResponse } from "../schema/auth.types";

export default function LoginInterface() {
  const [loginType, setLoginType] = useState<"member" | "organization">(
    "member"
  );
  const navigate = useNavigate();
  const memberLoginMutation = useMemberLoginDeferred();
  const organizationLoginMutation = useOrganizationLogin();

  // Initialize React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const determinePostLoginNavigation = (
    loginTypeValue: "member" | "organization",
    loginResponse: MemberLoginResponse | OrganizationLoginResponse,
    formData: LoginFormData
  ) => {
    let is2FARequired = false;

    if (loginTypeValue === "member") {
      if ("requires_2fa" in loginResponse) {
        is2FARequired = true;
      } else if ("user" in loginResponse) {
        const { user } = loginResponse;
        is2FARequired = user.two_factor_enabled === 1 || user.bypass_two_factor === 1;
      }

      if (is2FARequired) {
        navigate("/otp-signin-verification", {
          state: { email: formData.login, loginType: loginTypeValue },
        });
      } else {
        navigate("/two-factor-setup", { state: { loginResponse } });
      }
    } else {
      if ("requires_2fa" in loginResponse) {
        is2FARequired = true;
      }

      if (is2FARequired) {
        navigate("/otp-signin-verification", {
          state: { email: formData.login, loginType: loginTypeValue },
        });
      } else {
        navigate("/organization-profile");
      }
    }
  };

  // Handle form submission with validated data
  const onSubmit = async (data: LoginFormData) => {
    try {
      if (memberLoginMutation.isPending || organizationLoginMutation.isPending) {
        return;
      }

      let loginResponse: MemberLoginResponse | OrganizationLoginResponse;
      if (loginType === "member") {
        loginResponse = await memberLoginMutation.mutateAsync(data);
      } else {
        loginResponse = await organizationLoginMutation.mutateAsync(data);
      }

      determinePostLoginNavigation(loginType, loginResponse, data);
    } catch (error: unknown) {
      console.error("Login error:", error);
    }
  };

  const handleLoginTypeChange = (type: "member" | "organization") => {
    setLoginType(type);
    reset(); // Reset form when switching login type
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-56 px-8 pb-24">
          {/* Brand Logo */}
          <div className="flex justify-center ">
            <Link to="/">
              <img
                src={brandLogoDark}
                alt="Brand Logo"
                className="w-64 object-cover cursor-pointer"
              />
            </Link>
          </div>

          {/* Login Type Selector */}
          <div className="flex justify-center mb-6">
            <div className="flex gap-4 w-full max-w-md">
              <button
                className={`flex-1 py-3 px-6 text-responsive-xs text-center rounded-full border ${
                  loginType === "member"
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-primary border-primary"
                }`}
                onClick={() => handleLoginTypeChange("member")}
              >
                Member
              </button>
              <button
                className={`flex-1 py-3 px-6 text-responsive-xs text-center rounded-full border ${
                  loginType === "organization"
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-primary border-primary"
                }`}
                onClick={() => handleLoginTypeChange("organization")}
              >
                Organization
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-responsive-sm text-primary mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className={`w-full px-3 py-2 border ${
                  errors.login ? "border-red-500" : "border-primary"
                } rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                placeholder="Enter your email"
                {...register("login")}
              />
              {errors.login && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.login.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-responsive-sm text-primary mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className={`w-full px-3 py-2 border ${
                  errors.password ? "border-red-500" : "border-primary"
                } rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                placeholder="Enter your password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>



            {/* Login Button */}
            <div className="mb-6">
              <PrimaryButton
                variant="button3"
                label="Log in"
                buttonClass="w-full"
                type="submit"
              />
            </div>
          </form>

          {/* Horizontal Divider */}
          <div className="relative mb-6">
            <div className="w-full border-t border-gray-300" />
          </div>

          {/* Signup Link */}
          <div className="text-start">
            <p className="text-sm text-primary-75">
              No account yet?{" "}
              <Link to="/signup-member" className="text-secondary">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
