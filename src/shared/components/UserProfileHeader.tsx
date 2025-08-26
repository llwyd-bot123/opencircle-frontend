import avatarImage from "@src/assets/shared/avatar.png";
import { useProfileData, type ProfileData } from "@src/shared/hooks";

interface UserProfileHeaderProps {
  profile?: ProfileData | null; // Make profile optional and allow null
}

export function UserProfileHeader({ profile }: UserProfileHeaderProps) {
  // Use the custom hook to get profile utility functions
  const { getName, getRole, getBio, getImageUrl, getEmail } =
    useProfileData(profile);

  // Handle null/undefined profile case
  if (!profile) {
    return (
      <div className="flex-1 flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:pt-8">
        <div className="w-full sm:w-5/6 md:w-4/5 lg:w-2/3 flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start space-y-3 sm:space-y-0 sm:space-x-4 md:space-x-6 lg:space-x-8 xl:space-x-16">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <img
              src={avatarImage}
              alt="Default Profile"
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 rounded-full object-cover border-2 sm:border-3 md:border-4 border-gray-100"
            />
          </div>

          {/* Profile Info */}
          <div className="text-center sm:text-left flex-1 max-w-full sm:max-w-none overflow-hidden">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-primary mb-1 truncate">
              Loading...
            </h1>
            <p className="text-responsive-sm text-primary mb-1">User</p>
            <p className="text-responsive-xs text-primary leading-relaxed line-clamp-3 sm:line-clamp-none">
              Profile information is loading...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Get email from the hook
  const email = getEmail();

  return (
    <div className="flex-1 flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:pt-8">
      <div className="w-full sm:w-5/6 md:w-4/5 lg:w-2/3 flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start space-y-3 sm:space-y-0 sm:space-x-4 md:space-x-6 lg:space-x-8 xl:space-x-16">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <img
            src={getImageUrl()}
            alt="Profile"
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 rounded-full object-cover border-2 sm:border-3 md:border-4 border-gray-100"
          />
        </div>

        {/* Profile Info */}
        <div className="text-center sm:text-left flex-1 max-w-full sm:max-w-none overflow-hidden">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-primary mb-1 truncate">
            {getName()}
          </h1>
          <p className="text-responsive-xs text-primary mb-1">{getRole()}</p>
          {email && (
            <p className="text-responsive-xs text-placeholderbg mb-1 truncate">
              @ {email}
            </p>
          )}
          <p className="text-responsive-xs text-primary leading-relaxed line-clamp-3 sm:line-clamp-none">
            {getBio()}
          </p>
        </div>
      </div>
    </div>
  );
}
