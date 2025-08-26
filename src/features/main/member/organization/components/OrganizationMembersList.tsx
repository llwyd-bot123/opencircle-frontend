import React from "react";
import { PrimaryButton } from "@src/shared/components/PrimaryButton";
import leaveOrgIcon from "@src/assets/shared/leave_org_icon.svg";
import avatarImage from "@src/assets/shared/avatar.png";
import type {
  OrganizationMember,
  OrganizationMembership,
} from "../schema/organization.types";

interface OrganizationData {
  organizations: OrganizationMembership[];
}

interface OrganizationMembersListProps {
  data: OrganizationData | undefined;
  selectedOrgId: number | null;
  selectedOrg: OrganizationMembership | undefined;
  filterType: "joined" | "approval";
  handleOrgClick: (orgId: number) => void;
  handleFilterClick: (type: "joined" | "approval") => void;
  handleLeaveOrg: (organizationId: number) => void;
  getImageUrl: (
    directory: string,
    filename: string,
    fallback: string
  ) => string;
}

/**
 * Component that displays the organization list and members list
 */
const OrganizationMembersList: React.FC<OrganizationMembersListProps> = ({
  data,
  selectedOrgId,
  selectedOrg,
  filterType,
  handleOrgClick,
  handleFilterClick,
  handleLeaveOrg,
  getImageUrl,
}) => {
  return (
    <div className="flex justify-center items-center h-screen px-4">
      <div className="w-full md:w-11/12 lg:w-4/5 xl:w-2/3 bg-white flex flex-col md:flex-row h-full md:h-screen border shadow-lg border-primary/30">
        {/* Organizations List - Full width on mobile, left side on larger screens */}
        <div className="w-full md:w-1/3 bg-gray-100 overflow-hidden flex flex-col h-auto md:h-full">
          {/* New organization header with filter buttons */}
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
          <div className="flex-grow overflow-x-auto md:h-auto">
            <div className="flex flex-row md:flex-col">
              {data &&
                data.organizations.map((org: OrganizationMembership) => (
                  <div
                    key={org.organization_id}
                    onClick={() => handleOrgClick(org.organization_id)}
                    className={`
                p-3 sm:p-4 cursor-pointer transition-all duration-200 md:border-b border-gray-200
                ${
                  selectedOrgId === org.organization_id
                    ? "bg-white"
                    : "bg-athens_gray text-primary md:bg-athens_gray md:text-primary"
                }
              `}
                  >
                    <div className="flex md:items-center md:space-x-2 sm:space-x-3">
                      <div
                        className={`w-10 h-10 sm:w-10 sm:h-10 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 ${
                          selectedOrgId === org.organization_id &&
                          "border-2 border-secondary lg:border-0"
                        }`}
                      >
                        {org.organization_name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0 hidden md:block">
                        <h3 className="text-responsive-xs mb-1 truncate font-medium">
                          {org.organization_name}
                        </h3>
                        <div className="text-responsive-xxs text-primary-75">
                          {org.membership_status}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {(!data || data.organizations.length === 0) && (
            <div className="text-center py-6 sm:py-8 text-primary-75 bg-gray-100">
              <p className="text-responsive-xs">No organizations found</p>
            </div>
          )}
        </div>

        {/* Members List - Full width on mobile, right side on larger screens */}
        <div className="w-full md:w-2/3 border-t md:border-t-0 md:border-l border-primary/30 flex-grow md:h-full flex flex-col">
          <div className="px-3 sm:px-4 py-3 flex flex-col h-full">
            <div className="flex flex-row justify-between items-center mb-2">
              <h2 className="text-responsive-sm text-primary font-medium">
                Members
              </h2>
              {selectedOrg && (
                <div className="block">
                  <PrimaryButton
                    variant="leaveOrgButton"
                    label="Leave"
                    iconClass="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                    icon={leaveOrgIcon}
                    onClick={() => handleLeaveOrg(selectedOrg.organization_id)}
                  />
                </div>
              )}
            </div>

            <hr className="mt-[2px]" />

            <div className="px-2 flex-grow overflow-hidden">
              <div className="spacing-responsive-sm h-full overflow-y-auto mt-2 sm:mt-3">
                {selectedOrg && selectedOrg.members.length > 0 ? (
                  selectedOrg.members.map((member: OrganizationMember) => (
                    <div
                      key={member.user_id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <img
                          src={getImageUrl(
                            member.profile_picture.directory,
                            member.profile_picture.filename,
                            avatarImage
                          )}
                          alt={`${member.first_name} ${member.last_name} avatar`}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-primary text-responsive-xs font-medium">
                            {member.first_name} {member.last_name}
                          </p>
                          <p className="text-responsive-xxs text-placeholderbg">
                            {member.status.toLowerCase() === "approved"
                              ? ""
                              : member.status.toLowerCase() === "pending"
                              ? "Pending"
                              : "Unknown"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 sm:py-8 text-primary-75">
                    <p className="text-responsive-xs">
                      {selectedOrg
                        ? "No members in this organization"
                        : "Select an organization to view members"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationMembersList;
