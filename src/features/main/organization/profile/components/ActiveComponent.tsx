import { useState } from "react";
import {
  CommentsModal,
  EventFormModal,
  ConfirmationModal,
  EventParticipantsModal,
} from "@src/shared/components/modals";
import { EventActivePost } from "./subcomponents/EventActivePost";
import {
  useImageUrl,
  useInfiniteScroll,
  useConfirmationModal,
} from "@src/shared/hooks";
import { useAuthStore } from "@src/shared/store";
import { isMember, isOrganization } from "@src/shared/utils";
import avatarImage from "@src/assets/shared/avatar.png";
import { useInfiniteOrganizationEvents } from "../model/event.infinite.query";
import { useDeleteEvent } from "../model/event.mutation";
import { LoadingState, ErrorState } from "@src/shared/components";
import { useInfiniteContentComments } from "@src/features/comments/model/comment.infinite.query";
import type { CommentsResponse } from "@src/features/comments/schema/comment.types";

export default function ActiveComponent() {
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [isEventFormModalOpen, setIsEventFormModalOpen] = useState(false);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [participantsModalTab, setParticipantsModalTab] = useState<
    "members" | "requests"
  >("members");
  const [eventFormMode, setEventFormMode] = useState<"create" | "edit">(
    "create"
  );
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const {
    isConfirmModalOpen,
    modalConfig,
    openConfirmationModal,
    closeConfirmationModal,
  } = useConfirmationModal();

  const { user } = useAuthStore();
  const { getImageUrl } = useImageUrl();

  // Get current user avatar URL

  // Fetch organization events with infinite scrolling
  const {
    data: infiniteEventsData,
    isLoading: isEventsLoading,
    error: eventsError,
    fetchNextPage: fetchNextEventsPage,
    hasNextPage: hasNextEventsPage,
    isFetchingNextPage: isFetchingNextEventsPage,
    isError: isEventsError,
  } = useInfiniteOrganizationEvents({
    account_uuid: user?.uuid || "",
    per_page: 5,
  });

  // Function to handle loading more events
  const handleFetchNextPage = () => {
    if (!isFetchingNextEventsPage && hasNextEventsPage) {
      fetchNextEventsPage();
    }
  };

  // Setup infinite scroll
  const { sentinelRef: loadMoreRef } = useInfiniteScroll({
    onLoadMore: handleFetchNextPage,
    hasMore: !!hasNextEventsPage,
    isLoading: isFetchingNextEventsPage,
    enabled: !isEventsLoading && !isEventsError,
  });

  // Flatten the paginated events data
  const eventsData =
    infiniteEventsData?.pages.flatMap((page) => page.active_events) || [];

  const handleEdit = (eventId: number) => {
    console.log("Edit clicked for event:", eventId);
    setSelectedEventId(eventId);
    setEventFormMode("edit");
    setIsEventFormModalOpen(true);
  };

  const deleteEventMutation = useDeleteEvent();

  const handleDelete = (eventId: number) => {
    setSelectedEventId(eventId);
    openConfirmationModal({
      title: "Delete Event",
      message:
        "This will permanently remove the event and all related details. Proceed?",
      confirmButtonText: "Delete",
      confirmButtonVariant: "primary",
      onConfirm: async () => {
        try {
          await deleteEventMutation.mutateAsync(eventId);
          console.log("Event deleted successfully:", eventId);
        } catch (error) {
          console.error("Failed to delete event:", error);
        }
      },
    });
  };

  const handleViewMoreComments = (eventId: number) => {
    setSelectedEventId(eventId);
    setIsCommentsModalOpen(true);
  };

  const handleViewMoreMembers = (eventId: number) => {
    setSelectedEventId(eventId);
    setParticipantsModalTab("members");
    setIsParticipantsModalOpen(true);
  };

  const handleViewMoreRequests = (eventId: number) => {
    setSelectedEventId(eventId);
    setParticipantsModalTab("requests");
    setIsParticipantsModalOpen(true);
  };

  // Fetch comments for the selected event with infinite scrolling
  const {
    data: infiniteCommentsData,
    isLoading: isCommentsLoading,
    error: commentsError,
    fetchNextPage: fetchNextCommentsPage,
    hasNextPage: hasNextCommentsPage,
    isFetchingNextPage: isFetchingNextCommentsPage,
  } = useInfiniteContentComments({
    eventId: selectedEventId || 0,
    limit: 5,
  });

  // Flatten the pages of comments into a single array
  const comments =
    infiniteCommentsData?.pages?.flatMap(
      (page: CommentsResponse) => page.comments
    ) || [];
  // Get the total number of comments from the first page
  const totalComments = infiniteCommentsData?.pages?.[0]?.total || 0;

  const handleOpenCreateEventModal = () => {
    setSelectedEventId(null);
    setEventFormMode("create");
    setIsEventFormModalOpen(true);
  };

  const currentAvatar = getImageUrl(
    isMember(user)
      ? user?.profile_picture?.directory
      : isOrganization(user)
      ? user?.logo?.directory
      : undefined,
    isMember(user)
      ? user?.profile_picture?.filename
      : isOrganization(user)
      ? user?.logo?.filename
      : undefined,
    avatarImage
  );

  console.log("events", eventsData);

  return (
    <div className="w-full lg:w-1/2 mx-auto p-8">
      {/* Comment Card */}
      <div className="bg-white rounded-xl h-auto sm:h-[104px] p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-row items-center space-x-2 sm:space-x-4 h-full">
          {/* Avatar Column */}
          <div className="flex-shrink-0">
            <img
              src={currentAvatar}
              alt="User Avatar"
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full object-cover"
            />
          </div>

          {/* Input Column */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Post an event..."
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-athens_gray border border-transparent rounded-full text-responsive-xs cursor-pointer"
              onClick={handleOpenCreateEventModal}
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isEventsLoading && <LoadingState message="Loading events..." />}

      {/* Error State */}
      {isEventsError && (
        <ErrorState
          message={`Failed to load events. ${
            eventsError?.message || "Please try again later."
          }`}
        />
      )}

      {/* Events List */}
      {!isEventsLoading && !isEventsError && eventsData.length === 0 && (
        <div className="text-center py-8">
          <p className="text-placeholderbg text-responsive-sm">
            No events found. Create your first event!
          </p>
        </div>
      )}

      {/* Event Posts */}
      {!isEventsLoading &&
        !isEventsError &&
        eventsData &&
        eventsData.length > 0 && (
          <div className="space-y-6">
            {eventsData.map((event) => (
              <EventActivePost
                key={event.id}
                event={event}
                currentUserAvatar={currentAvatar}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewMoreComments={() => handleViewMoreComments(event.id)}
                onViewMoreMembers={() => handleViewMoreMembers(event.id)}
                onViewMoreRequests={() => handleViewMoreRequests(event.id)}
              />
            ))}

            {/* Infinite scroll sentinel element */}
            <div className="w-full my-4">
              {isFetchingNextEventsPage && (
                <LoadingState
                  message="Loading more events..."
                  className="py-4 text-center"
                />
              )}
              {isEventsError && !isFetchingNextEventsPage && (
                <div className="flex flex-col items-center py-4">
                  <ErrorState
                    message="Failed to load more events."
                    className="mb-2 text-center"
                  />
                  <button
                    onClick={handleFetchNextPage}
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark mt-2"
                  >
                    Retry
                  </button>
                </div>
              )}
              {/* Always render sentinel element but with different heights */}
              <div
                ref={loadMoreRef}
                className={`w-full ${hasNextEventsPage ? "h-20" : "h-4"}`}
                style={{ marginBottom: "20px" }}
              />
            </div>
          </div>
        )}

      {/* Event Form Modal */}
      <EventFormModal
        isOpen={isEventFormModalOpen}
        onClose={() => setIsEventFormModalOpen(false)}
        mode={eventFormMode}
        eventId={selectedEventId || undefined}
      />

      {/* Comments Modal */}
      <CommentsModal
        isOpen={isCommentsModalOpen}
        onClose={() => setIsCommentsModalOpen(false)}
        comments={comments}
        currentUserAvatar={currentAvatar}
        isLoading={isCommentsLoading}
        error={commentsError}
        eventId={selectedEventId || 0}
        fetchNextPage={fetchNextCommentsPage}
        hasNextPage={hasNextCommentsPage}
        isFetchingNextPage={isFetchingNextCommentsPage}
        totalComments={totalComments}
      />

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

      {/* Event Participants Modal */}
      {selectedEventId && (
        <EventParticipantsModal
          isOpen={isParticipantsModalOpen}
          onClose={() => setIsParticipantsModalOpen(false)}
          initialTab={participantsModalTab}
          eventId={selectedEventId}
        />
      )}
    </div>
  );
}
