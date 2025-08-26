import React from "react";
import type { PendingOrganizationMembershipsResponse } from "../schema/organization.types";
import { PrimaryButton } from "@src/shared/components/PrimaryButton";

interface PendingOrganizationProps {
  data: PendingOrganizationMembershipsResponse | undefined;
  selectedOrgId: number | null;
  filterType: "joined" | "approval";
  handleFilterClick: (type: "joined" | "approval") => void;
  handleLeaveOrg: (organizationId: number) => void;
  getImageUrl: (
    directory?: string,
    filename?: string,
    fallbackUrl?: string
  ) => string;
}

/**
 * PendingOrganization component with filter buttons
 * This component displays pending organization membership requests
 */
const PendingOrganization: React.FC<PendingOrganizationProps> = ({
  data,
  filterType,
  handleFilterClick,
  handleLeaveOrg,
  getImageUrl,
}) => {
  const handleCardClick = (orgId: number) => {
    // Navigate to organization detail page in the future
    // Implementation will be added later
    console.log(`Navigating to organization ${orgId}`);
  };

  return (
    <div className="flex justify-center items-center h-screen px-4">
      <div className="w-full md:w-11/12 lg:w-4/5 xl:w-2/3 bg-gray-100 flex flex-col h-full md:h-screen border shadow-lg border-primary/30">
        <div className="bg-white padding-responsive-sm flex justify-between items-center border-b border-gray-200">
          <div className="flex">
            <button
              className={`text-responsive-xxs ${
                filterType === "joined"
                  ? "text-primary font-medium"
                  : "text-primary-75"
              }`}
              onClick={() => handleFilterClick("joined")}
            >
              Joined
            </button>
            <div className="w-px bg-primary mx-2 my-1"></div>
            <button
              className={`text-responsive-xxs ${
                filterType === "approval"
                  ? "text-primary font-medium"
                  : "text-primary-75"
              }`}
              onClick={() => handleFilterClick("approval")}
            >
              For Approval
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto">
          {data && data.pending_memberships.length > 0 ? (
            <div className="space-y-3 md:space-y-4">
              {data.pending_memberships.map((org) => (
                <div
                  key={org.organization_id}
                  className="flex items-center justify-between p-3 hover:bg-white hover:shadow-md transition-all duration-200 group cursor-pointer"
                  onClick={() => handleCardClick(org.organization_id)}
                >
                  <div className="flex items-center space-x-3">
                    {org.organization_logo ? (
                      <img
                        src={getImageUrl(
                          org.organization_logo.directory,
                          org.organization_logo.filename
                        )}
                        alt={`${org.organization_name} logo`}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                        {org.organization_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-responsive-xs md:text-responsive-sm font-medium text-primary group-hover:font-bold">
                        {org.organization_name}
                      </h3>
                      <p className="text-responsive-xxs text-gray-500">
                        {org.organization_category}
                      </p>
                    </div>
                  </div>

                  <div
                    className="relative z-10"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <PrimaryButton
                      variant="removeButton"
                      label="Remove"
                      iconClass="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                      onClick={() => handleLeaveOrg(org.organization_id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-responsive-sm text-gray-500">
                No pending organization requests.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingOrganization;
