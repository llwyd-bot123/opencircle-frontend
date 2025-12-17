import { UserProfileHeader } from "@src/shared/components/UserProfileHeader";
import { useState, useEffect } from "react";
import PostComponent from "../components/PostComponent";
import EventComponent from "../components/EventComponent";
import { useAuthStore } from "@src/shared/store/auth";
import { CalendarSection } from "@src/features/calendar/ui/CalendarSection";
import { useMemberProfileQuery } from "../model/member.query";
import { useImageUrl } from "@src/shared/hooks";
import avatarImage from "@src/assets/shared/avatar.png";

type MemberProfileInterfaceProps = {
  accountUuid?: string;
};

export default function MemberProfileInterface({ accountUuid }: MemberProfileInterfaceProps) {
  // Initialize with stored tab or default to "post"
  const [activeTab, setActiveTab] = useState(() => {
    const storedTab = localStorage.getItem("memberProfileActiveTab");
    return storedTab || "post";
  });
  const { user } = useAuthStore();
  const effectiveUuid = accountUuid || user?.uuid || "";

  const { data: visitedProfile } = useMemberProfileQuery(effectiveUuid);
  const { getImageUrl } = useImageUrl();

  const headerProfile = visitedProfile
    ? {
        name: `${visitedProfile.first_name} ${visitedProfile.last_name}`,
        role: "member",
        bio: visitedProfile.bio,
        username: visitedProfile.username,
        avatarUrl: getImageUrl(
          visitedProfile.profile_picture?.directory,
          visitedProfile.profile_picture?.filename,
          avatarImage
        ),
      }
    : user;

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("memberProfileActiveTab", activeTab);
  }, [activeTab]);

  const profileTabs = [
    { id: "post", label: "Post" },
    { id: "events", label: "Events" },
    { id: "calendar", label: "Calendar" },
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "post":
        return <PostComponent accountUuid={effectiveUuid} />;
      case "events":
        return <EventComponent accountUuid={effectiveUuid} />;
      case "calendar":
        return <CalendarSection userType="member" accountUuid={effectiveUuid} />;
      default:
        return <PostComponent accountUuid={effectiveUuid} />;
    }
  };
  return (
    <div className="w-full min-h-screen">
      {/* Profile Header Section */}
      <div className="w-full h-auto sm:h-64 md:h-72 bg-white relative flex flex-col">
        {/* Profile Details Section - Centered */}
        <UserProfileHeader profile={headerProfile} />

        {/* Menu Section - Fixed at Bottom */}
        <nav className="flex justify-center px-2 sm:px-4 sm:pb-0">
          <div className="flex overflow-x-auto" >
            {profileTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative py-2 sm:py-3 md:py-4 px-2 sm:px-3 text-responsive-sm font-bold text-center w-[140px] transition-colors duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-placeholderbg hover:text-primary"
                }`}
              >
                {tab.label}
                {/* Active indicator */}
                {activeTab === tab.id && (
                  <div className="absolute border-2 sm:border-3 md:border-4 bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Dynamic Content Section */}
      <div className="w-full">{renderActiveComponent()}</div>
    </div>
  );
}
