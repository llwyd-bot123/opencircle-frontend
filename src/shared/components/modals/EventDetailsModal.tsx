import { useState } from "react";
import { Modal } from "../Modal";
import { checkOwnership, useFormatDate, useImageUrl } from "@src/shared/hooks";
import avatarImage from "@src/assets/shared/avatar.png";
import { CommentsSection } from "@src/features/comments/ui/CommentsSection";
import { PrimaryButton } from "@src/shared/components/PrimaryButton";
import { DropdownMenu } from "@src/shared/components/DropdownMenu";
import pendingIcon from "@src/assets/shared/for_approval_icon.svg";
import joinedIcon from "@src/assets/shared/joined_icon.svg";
import joinIcon from "@src/assets/shared/join_icon.svg";
import { CommentsModal } from "./CommentsModal";
import { useInfiniteContentComments } from "@src/features/comments/model/comment.infinite.query";
import { useGetEventWithComments } from "@src/features/main/organization/profile/model/event.query";
import { LoadingState } from "@src/shared/components/states/LoadingState";
import { ErrorState } from "@src/shared/components/states/ErrorState";
import { useAuthStore } from "@src/shared/store/auth";

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: number;
  userRole?: "member" | "organization";
  currentUserAvatar?: string;
  onEdit?: (eventId: number) => void;
  onDelete?: (eventId: number) => void;
  onJoinOrganization?: (orgId: number) => void;
  onCancelJoiningOrganization?: (orgId: number) => void;
  onLeaveOrganization?: (orgId: number) => void;
  onRsvpEvent?: (eventId: number) => void;
  onDeleteRsvpEvent?: (rsvpId: number) => void;
}

/**
 * Modal component for displaying event details with integrated comments section
 * Redesigned to match PublicEventPost.tsx styling and functionality
 */
export function EventDetailsModal({
  isOpen,
  onClose,
  eventId,
  userRole = "member",
  currentUserAvatar = avatarImage,
  onEdit,
  onDelete,
  onJoinOrganization,
  onCancelJoiningOrganization,
  onLeaveOrganization,
  onRsvpEvent,
  onDeleteRsvpEvent,
}: EventDetailsModalProps) {
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const { getImageUrl } = useImageUrl();
  const { formatFriendlyDateTime, formatRelativeTime } = useFormatDate();
  const { user } = useAuthStore();
  const accountUuid = user?.uuid || "";
  

  // Fetch event data with comments using React Query
  const {
    data: event,
    isLoading: isLoadingEvent,
    error: eventError,
  } = useGetEventWithComments(eventId, accountUuid, isOpen);

  // Set up infinite comments query
  const {
    data: commentsData,
    isLoading: isLoadingComments,
    error: commentsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteContentComments({
    eventId: eventId,
    limit: 5,
  });

  const handleViewMoreComments = () => {
    setIsCommentsModalOpen(true);
  };

  const allComments =
    commentsData?.pages.flatMap((page) => page.comments ?? []) || [];

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
        {isLoadingEvent && (
          <LoadingState message="Loading event details..." className="p-8" />
        )}

        {eventError && (
          <ErrorState 
            message="Error loading event details. Please try again later." 
            className="p-8" 
          />
        )}

        {/* Event Content */}
        {event && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden px-4 sm:px-6">
          {/* 1. Header with Avatar, Name, Time and buttons */}
          <div className="p-4 sm:p-0 pt-4 sm:pt-6 flex flex-row items-start justify-between">
            <div className="flex flex-row items-center space-x-2 sm:space-x-3">
              <img
                src={getImageUrl(
                  event.organization?.logo?.directory,
                  event.organization?.logo?.filename,
                  avatarImage
                )}
                alt="Event Creator"
                className="w-10 h-10 sm:w-14 sm:h-14 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <h4 className="text-primary text-responsive-xs font-bold">
                  {event.organization?.name}{" "}
                  <span className="text-authlayoutbg font-normal">
                    posted an event
                  </span>
                </h4>
                <p className="text-placeholderbg text-responsive-xxs">
                  {formatRelativeTime(event.created_date)}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              {/* Horizontal 3-dot menu - only show if user is the owner */}
              {checkOwnership({
                type: "event",
                ownerId: event.organization?.account_id,
              }) && (
                <DropdownMenu
                  onEdit={() => onEdit?.(Number(event.id))}
                  onDelete={() => onDelete?.(Number(event.id))}
                />
              )}

              {/* Conditional rendering based on user role and membership status */}
              {userRole === "member" && (
                <>
                  {/* Show Join Organization button when status is null or rejected */}
                  {(!event.user_membership_status_with_organizer ||
                    event.user_membership_status_with_organizer ===
                      "rejected") && (
                    <PrimaryButton
                      variant="joinStatusButton"
                      iconClass="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
                      label="Join Organization"
                      responsiveLabel="Join"
                      icon={joinIcon}
                      onClick={() =>
                        onJoinOrganization?.(
                          Number(event.organization_id)
                        )
                      }
                    />
                  )}

                  {/* Show For Approval button when status is pending */}
                  {event.user_membership_status_with_organizer ===
                    "pending" && (
                    <PrimaryButton
                      variant="iconButton"
                      iconClass="w-4 h-4 sm:w-5 sm:h-5"
                      label=""
                      icon={pendingIcon}
                      buttonClass="p-1"
                      onClick={() =>
                        onCancelJoiningOrganization?.(
                          Number(event.organization_id)
                        )
                      }
                    />
                  )}

                  {/* Show only icon when status is approved */}
                  {event.user_membership_status_with_organizer ===
                    "approved" && (
                    <PrimaryButton
                      variant="iconButton"
                      iconClass="w-4 h-4 sm:w-5 sm:h-5"
                      label=""
                      icon={joinedIcon}
                      onClick={() =>
                        onLeaveOrganization?.(
                          Number(event.organization_id)
                        )
                      }
                    />
                  )}
                </>
              )}
            </div>
          </div>

          {/* 2. Event Title */}
          <div className="pb-4 pt-4">
            <h3 className="text-primary font-bold text-responsive-sm">
              {event.title}
            </h3>
          </div>

          {/* 3. Event Date/Time */}
          <div className="flex items-center space-x-2 pb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-primary"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-primary text-responsive-xs">
              {formatFriendlyDateTime(event.event_date)}
            </span>
          </div>

          {/* 4. Location */}
          <div className="flex items-center space-x-2 pb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-primary"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9l-4.9 4.9-4.9-4.9a7 7 0 010-9.9zM10 6.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-primary text-responsive-xs">
              {event.address.house_building_number}, {event.address.barangay},{" "}
              {event.address.city}, {event.address.province},{" "}
              {event.address.country}
            </span>
          </div>

          {/* Only show RSVP button for members, not for organizations, and only for future events */}
          {userRole === "member" && event && new Date(event.event_date) > new Date() && (
            <div className="mb-4">
              {/* Show RSVP button if user hasn't RSVPed yet */}
              {!event.user_rsvp && (
                <PrimaryButton
                  variant={"rsvpButton"}
                  label={"RSVP"}
                  onClick={() => onRsvpEvent?.(Number(event.id))}
                />
              )}

              {/* Show Pending button if user has RSVPed and status is pending */}
              {event.user_rsvp && event.user_rsvp?.status === "pending" && (
                <PrimaryButton
                  variant={"pendingEventButton"}
                  label={"Pending"}
                  onClick={() =>
                    onDeleteRsvpEvent?.(Number(event.user_rsvp?.rsvp_id))
                  }
                />
              )}

              {/* Show Cancel RSVP button if user has RSVPed and status is approved */}
              {event.user_rsvp && event.user_rsvp?.status === "approved" && (
                <PrimaryButton
                  variant={"activeEventButton"}
                  label={"Cancel RSVP"}
                  onClick={() =>
                    onDeleteRsvpEvent?.(Number(event.user_rsvp?.rsvp_id))
                  }
                />
              )}
            </div>
          )}

          {/* 5. Description */}
          <div className="bg-athens_gray p-3 sm:p-4 rounded-xl text-responsive-xs text-primary leading-relaxed mb-4">
            <p>{event.description}</p>
          </div>

          {/* 6. Event Image */}
          {event.image && (
            <div className="w-full h-40 sm:h-48 md:h-56 lg:h-[300px] overflow-hidden mb-4">
              <img
                src={getImageUrl(
                  event.image.directory,
                  event.image.filename,
                  ""
                )}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <hr className="my-4 text-gainsboro" />

          {/* Comments Section */}
          <CommentsSection
            comments={event.latest_comments || []}
            totalComments={event.total_comments || 0}
            currentUserAvatar={currentUserAvatar}
            onViewMoreComments={handleViewMoreComments}
            contentId={Number(event.id)}
            contentType="event"
          />
        </div>
        )}
      </Modal>

      {/* Comments Modal for viewing all comments */}
      {event && (
      <CommentsModal
        isOpen={isCommentsModalOpen}
        onClose={() => setIsCommentsModalOpen(false)}
        comments={allComments}
        isLoading={isLoadingComments}
        error={commentsError}
        currentUserAvatar={currentUserAvatar}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        totalComments={event.total_comments || 0}
        eventId={eventId}
      />
      )}
    </>
  );
}
