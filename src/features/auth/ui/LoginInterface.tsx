import { PrimaryButton } from "@src/shared/components/PrimaryButton";
import brandLogoDark from "@src/assets/brand-dark.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMemberLogin, useOrganizationLogin } from "../model";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../schema/auth.schema";

export default function LoginInterface() {
  const [error, setError] = useState("");
  const [loginType, setLoginType] = useState<"member" | "organization">(
    "member"
  );
  const navigate = useNavigate();
  const memberLoginMutation = useMemberLogin();
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
      email: "",
      password: "",
    },
  });

  // Handle form submission with validated data
  const onSubmit = async (data: LoginFormData) => {
    // Clear previous errors
    setError("");

    try {
      if (loginType === "member") {
        // Login as member
        await memberLoginMutation.mutateAsync(data);


        navigate("/member-profile");
      } else {
        // Login as organization
        await organizationLoginMutation.mutateAsync(data);

        navigate("/organization-profile");
      }
    } catch (error: unknown) {
      // Handle login errors without navigating
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(String(error)); // fallback in case it's not an Error object
      }
    }
  };

  const handleLoginTypeChange = (type: "member" | "organization") => {
    setLoginType(type);
    setError(""); // Clear any previous errors when switching login type
    reset(); // Reset form when switching login type
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-56 px-8 pb-24">
          {/* Brand Logo */}
          <div className="flex justify-center ">
            <img
              src={brandLogoDark}
              alt="Brand Logo"
              className="w-64 object-cover"
            />
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
                  errors.email ? "border-red-500" : "border-primary"
                } rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                placeholder="Enter your email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
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

            {/* API Error Message */}
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

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
