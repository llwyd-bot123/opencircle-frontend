// import { useState } from "react";
import type { CalendarEvent } from "@src/features/calendar/schema/calendar.type";
// import type { ContentComment } from "@src/features/comments/schema/comment.types";
import { Modal } from "../Modal";
// import { CommentsSection } from "@src/features/comments/ui/CommentsSection";
// import { CommentsModal } from "./CommentsModal";
import { useImageUrl, useFormatDate } from "@src/shared/hooks";
// import { useInfiniteContentComments } from "@src/features/comments/model/comment.infinite.query";
// import {
//   useRsvpEvent,
//   useDeleteRsvp,
// } from "@src/features/home/model/home.mutation";
// import { useConfirmationModal } from "@src/shared/hooks/useConfirmationModal";
// import { PrimaryButton } from "@src/shared/components/PrimaryButton";
// import { LoadingState, ErrorState } from "@src/shared/components";
// import { useAuthStore } from "@src/shared/store/auth";
// import avatarImage from "@src/assets/shared/avatar.png";
// import { isMember, isOrganization } from "@src/shared/utils";

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent;
  userRole?: "member" | "organization";
}

/**
 * Modal component for displaying event details with integrated comments section
 * Redesigned to match PublicEventPost.tsx styling and functionality
 */
export function EventDetailsModal({
  isOpen,
  onClose,
  event,
}: // userRole = "member",
EventDetailsModalProps) {
  // const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const { getImageUrl } = useImageUrl();
  const { formatFriendlyDateTime, formatRelativeTime } = useFormatDate();
  // const { user } = useAuthStore();
  // const rsvpEventMutation = useRsvpEvent();
  // const deleteRsvpMutation = useDeleteRsvp();
  // const { openConfirmationModal } = useConfirmationModal();

  // Fetch comments for the event with infinite scrolling
  // const {
  //   data: infiniteCommentsData,
  //   isLoading: isCommentsLoading,
  //   error: commentsError,
  //   fetchNextPage: fetchNextCommentsPage,
  //   hasNextPage: hasNextCommentsPage,
  //   isFetchingNextPage: isFetchingNextCommentsPage,
  // } = useInfiniteContentComments({
  //   eventId: event.event_id,
  //   limit: 5,
  // });

  // // Flatten the pages of comments into a single array
  // const comments =
  //   infiniteCommentsData?.pages?.flatMap((page) => page.comments) || [];

  // // Get the total number of comments from the first page
  // const totalComments = infiniteCommentsData?.pages?.[0]?.total || 0;

  // // Get current user avatar for comments
  // const currentAvatar = getImageUrl(
  //   isMember(user)
  //     ? user?.profile_picture?.directory
  //     : isOrganization(user)
  //     ? user?.logo?.directory
  //     : undefined,
  //   isMember(user)
  //     ? user?.profile_picture?.filename
  //     : isOrganization(user)
  //     ? user?.logo?.filename
  //     : undefined,
  //   avatarImage
  // );

  // Handle RSVP event
  // const handleRsvpEvent = () => {
  //   openConfirmationModal({
  //     title: "Reserve Your Spot",
  //     message:
  //       "Are you sure you want to reserve your spot for this event? You will receive a confirmation once your reservation is completed.",
  //     confirmButtonText: "Reserve",
  //     confirmButtonVariant: "primary",
  //     onConfirm: async () => {
  //       try {
  //         await rsvpEventMutation.mutateAsync(event.event_id);
  //         console.log("Successfully RSVPed to event:", event.event_id);
  //       } catch (error) {
  //         console.error("Failed to RSVP to event:", error);
  //       }
  //     },
  //   });
  // };

  // Handle delete RSVP
  // const handleDeleteRsvpEvent = (rsvpId: number) => {
  //   openConfirmationModal({
  //     title: "Cancel Reservation",
  //     message:
  //       "Are you sure you want to cancel your reservation for this event?",
  //     confirmButtonText: "Cancel Reservation",
  //     confirmButtonVariant: "primary",
  //     onConfirm: async () => {
  //       try {
  //         await deleteRsvpMutation.mutateAsync(rsvpId);
  //         console.log("Successfully cancelled RSVP:", rsvpId);
  //       } catch (error) {
  //         console.error("Failed to cancel RSVP:", error);
  //       }
  //     },
  //   });
  // };

  // Handle view more comments
  // const handleViewMoreComments = () => {
  //   setIsCommentsModalOpen(true);
  // };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
        {/* Event Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden px-4 sm:px-6">
          {/* 1. Header with Avatar, Name, Time */}
          <div className="p-4 sm:p-0 pt-4 sm:pt-6 flex flex-row items-start justify-between">
            <div className="flex flex-row items-center space-x-2 sm:space-x-3">
              <img
                src={getImageUrl(
                  event.organization?.logo?.directory,
                  event.organization?.logo?.filename,
                  "https://placehold.co/40x40/29465b/ffffff?text=O"
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

          {/* Only show RSVP button for members, not for organizations */}
          {/* {userRole === "member" && (
              <div className="pb-4">
                {!event.user_rsvp && (
                  <PrimaryButton
                    variant={"rsvpButton"}
                    label={"RSVP"}
                    onClick={handleRsvpEvent}
                  />
                )}

                {event.user_rsvp && event.user_rsvp.status === "pending" && (
                  <PrimaryButton
                    variant={"pendingEventButton"}
                    label={"Pending"}
                    onClick={() => handleDeleteRsvpEvent(event.user_rsvp.rsvp_id)}
                  />
                )}

                {event.user_rsvp && 
                  (event.user_rsvp.status === "approved" || event.user_rsvp.status === "joined") && (
                  <PrimaryButton
                    variant={"activeEventButton"}
                    label={"Cancel RSVP"}
                    onClick={() => handleDeleteRsvpEvent(event.user_rsvp.rsvp_id)}
                  />
                )}
              </div>
            )} */}

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

          {/* 7. Comments Section */}
          {/* <div className="pb-4">
              {isCommentsLoading ? (
                <LoadingState message="Loading comments..." />
              ) : commentsError ? (
                <ErrorState message="Failed to load comments. Please try again later." />
              ) : (
                <CommentsSection
                  contentType="event"
                  contentId={event.event_id}
                  comments={comments}
                  totalComments={totalComments || 0}
                  currentUserAvatar={currentAvatar}
                  onViewMoreComments={handleViewMoreComments}
                />
              )}
            </div> */}
        </div>
      </Modal>

      {/* Comments Modal */}
      {/* <CommentsModal
        isOpen={isCommentsModalOpen}
        onClose={() => setIsCommentsModalOpen(false)}
        comments={comments}
        isLoading={isCommentsLoading}
        error={commentsError}
        currentUserAvatar={currentAvatar}
        fetchNextPage={fetchNextCommentsPage}
        hasNextPage={hasNextCommentsPage}
        isFetchingNextPage={isFetchingNextCommentsPage}
        totalComments={totalComments}
        eventId={event.event_id}
      /> */}
    </>
  );
}
