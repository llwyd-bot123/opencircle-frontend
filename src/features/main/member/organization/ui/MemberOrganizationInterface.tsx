import { useState } from "react";
import { ConfirmationModal } from "@src/shared/components/modals";
import { useConfirmationModal } from "@src/shared/hooks";
import {
  useOrganizationMembershipsQuery,
  usePendingOrganizationMembershipsQuery,
} from "../model/organization.query";
import { ErrorState, LoadingState } from "@src/shared/components/states";
import { useImageUrl } from "@src/shared/hooks/useImageUrl";
import { useLeaveOrganization } from "../model/organization.mutation";
import type { OrganizationMembership } from "../schema/organization.types";
import { useAuthStore } from "@src/shared/store";

// Import the new components
import OrganizationMembersList from "../components/OrganizationMembersList";
import PendingOrganization from "../components/PendingOrganization";

export default function MemberOrganizationInterface() {
  // Get current user's account UUID from auth store
  const { user } = useAuthStore();
  const accountUuid = user?.uuid;

  const {
    isConfirmModalOpen,
    modalConfig,
    openConfirmationModal,
    closeConfirmationModal,
  } = useConfirmationModal();

  // Use the image URL hook
  const { getImageUrl } = useImageUrl();

  // Fetch organization memberships data
  const { data, isLoading, isError, error, refetch } =
    useOrganizationMembershipsQuery(accountUuid);

  // Fetch pending organization memberships data
  const {
    data: pendingData,
    isLoading: isPendingLoading,
    isError: isPendingError,
    error: pendingError,
    refetch: refetchPending,
  } = usePendingOrganizationMembershipsQuery(accountUuid);

  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);

  // Set the first organization as selected when data is loaded
  if (data && data.organizations.length > 0 && selectedOrgId === null) {
    setSelectedOrgId(data.organizations[0].organization_id);
  }

  // Get selected organization
  const selectedOrg =
    data &&
    data.organizations.find(
      (org: OrganizationMembership) => org.organization_id === selectedOrgId
    );

  // Initialize leave organization mutation
  const leaveOrganizationMutation = useLeaveOrganization();

  const handleLeaveOrg = (organizationId: number) => {
    // Find the organization by ID from either joined or pending organizations
    const orgToLeave =
      data?.organizations.find(
        (org) => org.organization_id === organizationId
      ) ||
      pendingData?.pending_memberships.find(
        (org) => org.organization_id === organizationId
      );

    openConfirmationModal({
      title: "Leave Group Confirmation",
      message: `Are you sure you want to leave "${orgToLeave?.organization_name}"? Once you leave, you will no longer have access to its content or updates.`,
      confirmButtonText: "Leave",
      confirmButtonVariant: "primary",
      onConfirm: async () => {
        try {
          await leaveOrganizationMutation.mutateAsync(organizationId);
        } catch (error) {
          console.error(
            `Failed to leave organization: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
          // Error will be handled by the mutation's onError callback
        }
      },
    });
  };

  const handleOrgClick = (orgId: number) => {
    setSelectedOrgId(orgId);
  };

  // Filter state for organizations
  const [filterType, setFilterType] = useState<"joined" | "approval">("joined");

  const handleFilterClick = (type: "joined" | "approval") => {
    setFilterType(type);
    console.log(`Filter changed to: ${type}`);
  };

  return (
    <div className="w-full min-h-screen">
      {isLoading && <LoadingState message="Loading organizations..." />}

      {isError && (
        <ErrorState
          message={`Failed to load organizations: ${
            error instanceof Error ? error.message : "Unknown error"
          }`}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading &&
        !isError &&
        !isPendingLoading &&
        !isPendingError &&
        (filterType === "joined" ? (
          <OrganizationMembersList
            data={data}
            selectedOrgId={selectedOrgId}
            selectedOrg={selectedOrg}
            filterType={filterType}
            handleOrgClick={handleOrgClick}
            handleFilterClick={handleFilterClick}
            handleLeaveOrg={handleLeaveOrg}
            getImageUrl={getImageUrl}
          />
        ) : (
          <PendingOrganization
            filterType={filterType}
            handleFilterClick={handleFilterClick}
            data={pendingData}
            selectedOrgId={selectedOrgId}
            handleLeaveOrg={handleLeaveOrg}
            getImageUrl={getImageUrl}
          />
        ))}

      {isPendingLoading && filterType === "approval" && (
        <LoadingState message="Loading pending organizations..." />
      )}

      {isPendingError && filterType === "approval" && (
        <ErrorState
          message={`Failed to load pending organizations: ${
            pendingError instanceof Error
              ? pendingError.message
              : "Unknown error"
          }`}
          onRetry={() => refetchPending()}
        />
      )}

      {/* Confirmation Modal */}
      {modalConfig && (
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={closeConfirmationModal}
          onConfirm={modalConfig.onConfirm}
          title={modalConfig.title}
          message={modalConfig.message}
          confirmButtonText={modalConfig.confirmButtonText}
          confirmButtonVariant={modalConfig.confirmButtonVariant}
        />
      )}
    </div>
  );
}
