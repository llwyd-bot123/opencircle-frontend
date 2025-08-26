import { useState } from "react";
import ActiveComponent from "../components/ActiveComponent";
import PastEventsComponent from "../components/PastEventsComponent";
import { UserProfileHeader } from "@src/shared/components/UserProfileHeader";
import { useAuthStore } from "@src/shared/store/auth";
import { CalendarSection } from "@src/features/calendar/ui/CalendarSection";

export default function OrganizationProfileInterface() {
  const [activeTab, setActiveTab] = useState("active");
  const { user } = useAuthStore();

  const profileTabs = [
    { id: "active", label: "Active" },
    { id: "past-events", label: "Past Events" },
    { id: "calendar", label: "Calendar" },
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "active":
        return <ActiveComponent />;
      case "past-events":
        return <PastEventsComponent />;
      case "calendar":
        return <CalendarSection userType="organization" />;
      default:
        return <PastEventsComponent />;
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
