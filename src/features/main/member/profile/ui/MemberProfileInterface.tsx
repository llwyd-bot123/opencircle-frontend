import { UserProfileHeader } from "@src/shared/components/UserProfileHeader";
import { useState, useEffect } from "react";
import PostComponent from "../components/PostComponent";
import EventComponent from "../components/EventComponent";
import { useAuthStore } from "@src/shared/store/auth";
import { CalendarSection } from "@src/features/calendar/ui/CalendarSection";

export default function MemberProfileInterface() {
  // Initialize with stored tab or default to "post"
  const [activeTab, setActiveTab] = useState(() => {
    const storedTab = localStorage.getItem("memberProfileActiveTab");
    return storedTab || "post";
  });
  const { user } = useAuthStore();

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
        return <PostComponent />;
      case "events":
        return <EventComponent />;
      case "calendar":
        return <CalendarSection userType="member" />;
      default:
        return <PostComponent />;
    }
  };

  return (
    <div className="w-full min-h-screen">
      {/* Profile Header Section */}
      <div className="w-full h-auto sm:h-64 md:h-72 bg-white relative flex flex-col">
        {/* Profile Details Section - Centered */}
        <UserProfileHeader profile={user} />

        {/* Menu Section - Fixed at Bottom */}
        <nav className="flex justify-center px-2 sm:px-4 sm:pb-0">
          <div className="flex overflow-x-auto">
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
