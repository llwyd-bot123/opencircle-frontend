import type { ShareItem } from "@src/features/share/schema/share.types";
import type { EventData } from "@src/features/main/organization/profile/schema/event.type";
import type { AllMemberPostData } from "@src/features/main/member/profile/schema/post.types";
import { SharedEventPost } from "@src/features/share/components/SharedEventPost";
import { SharedMemberPost } from "@src/features/share/components/SharedMemberPost";
import { useFormatDate, useConfirmationModal, useImageUrl } from "@src/shared/hooks";
import { ConfirmationModal } from "@src/shared/components/modals";
import { useJoinOrganization } from "@src/features/home/model/home.mutation";
import { useLeaveOrganization } from "@src/features/main/member/organization/model/organization.mutation";
import avatarImage from "@src/assets/shared/avatar.png";

type SharedCardProps = {
  share: ShareItem;
};

export const SharedCard = ({ share }: SharedCardProps) => {
  const { formatRelativeTime } = useFormatDate();
  const { getImageUrl } = useImageUrl();
  const joinOrganizationMutation = useJoinOrganization();
  const leaveOrganizationMutation = useLeaveOrganization();
  const {
    isConfirmModalOpen,
    modalConfig,
    openConfirmationModal,
    closeConfirmationModal,
  } = useConfirmationModal();

  const handleJoinOrganization = (orgId: number) => {
    openConfirmationModal({
      title: "Request to Join",
      message:
        "Do you want to join this group? Once you join, you'll be able to access its content, participate in discussions, and receive updates.",
      confirmButtonText: "Join",
      confirmButtonVariant: "primary",
      onConfirm: async () => {
        try {
          await joinOrganizationMutation.mutateAsync(orgId);
        } catch (error) {
          console.error("Failed to request to join organization:", error);
        }
      },
    });
  };

  const handleCancelJoiningOrganization = (orgId: number) => {
    openConfirmationModal({
      title: "Cancel Join Request",
      message: "Do you want to cancel your request to join this organization?",
      confirmButtonText: "Cancel Request",
      confirmButtonVariant: "primary",
      onConfirm: async () => {
        try {
          await leaveOrganizationMutation.mutateAsync(orgId);
        } catch (error) {
          console.error("Failed to cancel join request:", error);
        }
      },
    });
  };

  const handleLeaveOrganization = (orgId: number) => {
    openConfirmationModal({
      title: "Leave Organization",
      message: "Do you want to leave this organization?",
      confirmButtonText: "Leave",
      confirmButtonVariant: "primary",
      onConfirm: async () => {
        try {
          await leaveOrganizationMutation.mutateAsync(orgId);
        } catch (error) {
          console.error("Failed to leave organization:", error);
        }
      },
    });
  };

  const account = share.account;
  const isOrganization = account?.type === "organization";

  const avatarSrc = (() => {
    if (!account) return avatarImage;
    if (isOrganization) {
      return getImageUrl(
        account.logo?.directory,
        account.logo?.filename,
        avatarImage
      );
    }
    return getImageUrl(
      account.profile_picture?.directory,
      account.profile_picture?.filename,
      avatarImage
    );
  })();


  console.log("shared post data", share)

  const displayName = (() => {
    if (!account) return "User";
    if (isOrganization) {
      return account.name || "Organization";
    }
    return `${account.first_name || "User"} ${account.last_name || ""}`;
  })();

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 w-full">
      <div className="flex flex-row items-start justify-between mb-3">
        <div className="flex flex-row items-center space-x-2 sm:space-x-3">
          <img src={avatarSrc} alt="Sharer" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover" />
          <div className="flex flex-col">
            <h4 className="text-primary text-responsive-xs">
              <span className="text-primary">{displayName} shared {share.content_type === 2 ? "an event" : "a post"}</span>
            </h4>
            <p className="text-placeholderbg text-responsive-xxs">{formatRelativeTime(share.date_created)}</p>
          </div>
        </div>
      </div>

      {share.comment && (
        <div className="mb-4">
          <p className="text-primary text-responsive-xs leading-relaxed">{share.comment}</p>
        </div>
      )}

      {share.content_type === 2 ? (
        <SharedEventPost
          event={share.content_details as EventData}
          onJoinOrganization={handleJoinOrganization}
          onCancelJoiningOrganization={handleCancelJoiningOrganization}
          onLeaveOrganization={handleLeaveOrganization}
        />
      ) : (
        <SharedMemberPost post={share.content_details as AllMemberPostData} />
      )}

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
};
