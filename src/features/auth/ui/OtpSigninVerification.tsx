import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { PrimaryButton } from "@src/shared/components/PrimaryButton";
import brandLogoDark from "@src/assets/brand-dark.png";
import { useVerifyTwoFactor } from "@src/features/auth/model/auth.mutations";
import { useAuthStore } from "@src/shared/store";

export default function OtpSigninVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const authStore = useAuthStore();
  const loginType: "member" | "organization" = location.state?.loginType || "member";
  const [useBackup, setUseBackup] = useState(false);
  const [token, setToken] = useState("");
  const verifyMutation = useVerifyTwoFactor();

  const handleSubmit = async () => {
    if (!token) return;
    try {
      const data = await verifyMutation.mutateAsync({ totp_token: token, account_type: loginType });
      if ('user' in data) {
        authStore.login(data);
        navigate('/member-profile');
      } else if ('organization' in data) {
        authStore.login(data);
        navigate('/organization-profile');
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('2FA verify error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-56 px-8 pb-24">
          <div className="flex justify-center items-center relative">
            <img src={brandLogoDark} alt="Brand Logo" className="w-64 object-cover" />
            <p className="absolute bottom-6 text-center text-base text-primary opacity-75">
              Create Events. Gather People. Make It Happen.
            </p>
          </div>

          <h1 className="text-center text-primary font-bold text-4xl pb-3">
            Two-Factor Sign-in Verification
          </h1>

        <p className="text-center text-base mb-8">
          {useBackup ? 'Enter one of your backup codes' : 'Enter the 6-digit Google Authenticator code'}
        </p>

        <div className="mb-6">
          <label className="block text-responsive-xs text-primary mb-2">
            {useBackup ? 'Backup code' : 'Authenticator code'}
          </label>
          <input
            type="text"
            maxLength={useBackup ? 10 : 6}
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder={useBackup ? 'xxxxxxxxxx' : '- - - - - -'}
            className="w-full px-3 py-2 border border-primary rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <PrimaryButton
            variant="button3"
            label={verifyMutation.isPending ? 'Verifying...' : 'Verify'}
            buttonClass="w-full"
            onClick={handleSubmit}
          />
          <PrimaryButton
            variant="button3"
            label={useBackup ? 'Use authenticator code' : 'Use backup code'}
            buttonClass="w-full"
            onClick={() => {
              setToken("");
              setUseBackup((prev) => !prev);
            }}
          />
        </div>
      </div>
    </div>
    </div>
  );
}