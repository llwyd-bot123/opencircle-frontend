import {
  useConfirmationModal,
  useImageUrl,
  useInfiniteScroll,
} from "@src/shared/hooks";
import { useAuthStore } from "@src/shared/store";
import { isMember, isOrganization } from "@src/shared/utils";
import avatarImage from "@src/assets/shared/avatar.png";
import { useState } from "react";
import {
  EventFormModal,
  ConfirmationModal,
  PostFormModal,
} from "@src/shared/components/modals";
import {
  useDeleteRsvp,
  useJoinOrganization,
  useRsvpEvent,
} from "../model/home.mutation";
import { useLeaveOrganization } from "@src/features/main/member/organization/model/organization.mutation";
import { useInfiniteRandomEvents } from "@src/features/main/organization/profile/model/event.infinite.query";
import { useDeleteEvent } from "@src/features/main/organization/profile/model/event.mutation";
import { ErrorState, LoadingState } from "@src/shared/components";
import { useInfiniteAllMemberPosts } from "@src/features/main/member/profile/model/post.infinite.query";
import { useDeletePost } from "@src/features/main/member/profile/model/post.mutation";
import { PublicEventPost } from "../components/PublicEventPost";
import { PublicMemberPost } from "../components/PublicMemberPost";

export default function HomeInterface() {
  // State for modals
  const [isEventFormModalOpen, setIsEventFormModalOpen] = useState(false);
  const [isPostFormModalOpen, setIsPostFormModalOpen] = useState(false);
  const [eventFormMode, setEventFormMode] = useState<"create" | "edit">(
    "create"
  );
  const [postFormMode, setPostFormMode] = useState<"create" | "edit">("create");
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  // We'll use this state when implementing comment viewing functionality in the future
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  // No additional confirmation modal state needed - using useConfirmationModal

  const { user } = useAuthStore();
  const { getImageUrl } = useImageUrl();

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

  // Initialize mutations
  const deletePostMutation = useDeletePost();
  const deleteEventMutation = useDeleteEvent();
  const joinOrganizationMutation = useJoinOrganization();
  const leaveOrganizationMutation = useLeaveOrganization();
  const rsvpEventMutation = useRsvpEvent();
  const deleteRsvpMutation = useDeleteRsvp();

  const {
    isConfirmModalOpen,
    modalConfig,
    openConfirmationModal,
    closeConfirmationModal,
  } = useConfirmationModal();

  // Fetch random events with infinite scrolling
  const {
    data: randomEventsData,
    isLoading: isLoadingEvents,
    isError: isErrorEvents,
    error: eventsError,
    fetchNextPage: fetchNextEventsPage,
    hasNextPage: hasNextEventsPage,
    isFetchingNextPage: isFetchingNextEventsPage,
  } = useInfiniteRandomEvents();

  // Fetch all member posts with infinite scrolling
  const {
    data: postsData,
    isLoading: isLoadingPosts,
    isError: isErrorPosts,
    error: postsError,
    fetchNextPage: fetchNextPostsPage,
    hasNextPage: hasNextPostsPage,
    isFetchingNextPage: isFetchingNextPostsPage,
  } = useInfiniteAllMemberPosts();

  // Determine if we should load more content (either events or posts)
  const hasMoreContent = !!hasNextEventsPage || !!hasNextPostsPage;
  const isLoadingMoreContent =
    isFetchingNextEventsPage || isFetchingNextPostsPage;
  const isLoading = isLoadingEvents || isLoadingPosts;
  const isError = isErrorEvents || isErrorPosts;

  // Set up infinite scrolling
  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: () => {
      // Load both events and posts if available
      if (hasNextEventsPage && !isFetchingNextEventsPage) {
        fetchNextEventsPage();
      }
      if (hasNextPostsPage && !isFetchingNextPostsPage) {
        fetchNextPostsPage();
      }
    },
    hasMore: hasMoreContent,
    isLoading: isLoadingMoreContent,
    enabled: !isLoading && !isError,
    rootMargin: "200px",
  });

  // Function to handle fetching next page for events
  const handleFetchNextEventsPage = () => {
    if (!isFetchingNextEventsPage && hasNextEventsPage) {
      void fetchNextEventsPage();
    }
  };

  // Function to handle fetching next page for posts
  const handleFetchNextPostsPage = () => {
    if (!isFetchingNextPostsPage && hasNextPostsPage) {
      void fetchNextPostsPage();
    }
  };

  // Function to handle fetching next page for both
  const handleFetchNextPage = () => {
    handleFetchNextEventsPage();
    handleFetchNextPostsPage();
  };

  // Flatten the events data from all pages
  const events =
    randomEventsData?.pages.flatMap((page) => page.random_events) || [];

  // Flatten the posts data from all pages
  const posts = postsData?.pages.flatMap((page) => page.posts) || [];

  const handleOpenCreateEventModal = () => {
    setSelectedEventId(null);
    setEventFormMode("create");
    setIsEventFormModalOpen(true);
  };

  /**
   * Opens the post form modal for creating a new post
   */
  const handleOpenCreatePostModal = () => {
    setSelectedPostId(null);
    setPostFormMode("create");
    setIsPostFormModalOpen(true);
  };

  /**
   * Handles editing an event by opening the event form modal in edit mode
   */
  const handleEditEvent = (eventId: number) => {
    setSelectedEventId(eventId);
    setEventFormMode("edit");
    setIsEventFormModalOpen(true);
  };

  /**
   * Handles deleting an event by showing a confirmation modal
   */
  const handleDeleteEvent = (eventId: number) => {
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

  const handleViewEventComments = (eventId: number) => {
    setSelectedEventId(eventId);
  };

  // This function will be expanded in the future to handle post comments viewing
  const handleViewPostComments = (postId: number) => {
    console.log(`Viewing comments for post ${postId}`);
    setSelectedPostId(postId);
  };

  /**
   * Handles editing a post by opening the post form modal in edit mode
   */
  const handleEditPost = (postId: number) => {
    setPostFormMode("edit");
    setSelectedPostId(postId);
    setIsPostFormModalOpen(true);
  };

  /**
   * Handles deleting a post by showing a confirmation modal
   */
  const handleDeletePost = (postId: number) => {
    setSelectedPostId(postId);
    openConfirmationModal({
      title: "Delete post",
      message:
        "This will permanently remove the post and all related details. Proceed?",
      confirmButtonText: "Delete",
      confirmButtonVariant: "primary",
      onConfirm: async () => {
        try {
          await deletePostMutation.mutateAsync(postId);
          console.log("Post deleted successfully:", postId);
        } catch (error) {
          console.error("Failed to delete post:", error);
        }
      },
    });
  };

  const handleJoinOrganization = (orgId: number) => {
    setSelectedPostId(orgId);
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
    setSelectedPostId(orgId);
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
    setSelectedPostId(orgId);
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

  /**
   * Handles RSVP for an event by showing a confirmation modal
   */
  const handleRsvpEvent = (eventId: number) => {
    setSelectedEventId(eventId);
    openConfirmationModal({
      title: "Reserve Your Spot",
      message:
        "Are you sure you want to reserve your spot for this event? You will receive a confirmation once your reservation is completed.",
      confirmButtonText: "Reserve",
      confirmButtonVariant: "primary",
      onConfirm: async () => {
        try {
          await rsvpEventMutation.mutateAsync(eventId);
          console.log("Successfully RSVPed to event:", eventId);
        } catch (error) {
          console.error("Failed to RSVP to event:", error);
        }
      },
    });
  };

  /**
   * Handles deleting an RSVP for an event by showing a confirmation modal
   */
  const handleDeleteRsvpEvent = (rsvpId: number) => {
    openConfirmationModal({
      title: "Cancel Reservation",
      message:
        "Are you sure you want to cancel your reservation for this event?",
      confirmButtonText: "Cancel Reservation",
      confirmButtonVariant: "primary",
      onConfirm: async () => {
        try {
          await deleteRsvpMutation.mutateAsync(rsvpId);
          console.log("Successfully cancelled RSVP:", rsvpId);
        } catch (error) {
          console.error("Failed to cancel RSVP:", error);
        }
      },
    });
  };

  return (
    <div className="w-full lg:w-1/2 mx-auto p-8">
      <div className="bg-white rounded-xl h-[90px] sm:h-[104px] p-3 sm:p-4 shadow-sm border border-gray-100 mb-4 sm:mb-6">
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
              placeholder={
                isOrganization(user)
                  ? "Post an event..."
                  : "What's on your mind..."
              }
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-athens_gray border border-transparent rounded-full text-responsive-xs cursor-pointer"
              onClick={
                isOrganization(user)
                  ? handleOpenCreateEventModal
                  : handleOpenCreatePostModal
              }
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {(isLoadingEvents || isLoadingPosts) &&
        !isFetchingNextEventsPage &&
        !isFetchingNextPostsPage && (
          <LoadingState message="Loading content..." />
        )}

      {/* Error State */}
      {(isErrorEvents || isErrorPosts) && (
        <ErrorState
          message={`Failed to load content. ${
            (eventsError || postsError)?.message || "Please try again later."
          }`}
        />
      )}

      {/* No Content */}
      {!isLoadingEvents &&
        !isLoadingPosts &&
        !isErrorEvents &&
        !isErrorPosts &&
        events.length === 0 &&
        posts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-placeholderbg text-responsive-xs">
              No content found. Create your first event or post!
            </p>
          </div>
        )}

      {/* Content Feed - Events and Posts */}
      {!isLoadingEvents &&
        !isLoadingPosts &&
        !isErrorEvents &&
        !isErrorPosts &&
        (events.length > 0 || posts.length > 0) && (
          <div className="space-y-6">
            {/* Interleave events and posts */}
            {/* For simplicity, we'll display events first, then posts */}
            {/* In a real app, you might want to sort them by date */}

            {/* Events */}
            {events.map((event) => (
              <PublicEventPost
                key={`event-${event.id}`}
                event={event}
                currentUserAvatar={currentAvatar}
                userRole={isMember(user) ? "member" : "organization"}
                onViewMoreComments={handleViewEventComments}
                onEdit={() => handleEditEvent(event.id)}
                onDelete={() => handleDeleteEvent(event.id)}
                onJoinOrganization={handleJoinOrganization}
                onCancelJoiningOrganization={handleCancelJoiningOrganization}
                onLeaveOrganization={handleLeaveOrganization}
                onRsvpEvent={handleRsvpEvent}
                onDeleteRsvpEvent={handleDeleteRsvpEvent}
              />
            ))}

            {/* Posts */}
            {posts.map((post) => {
              return (
                <PublicMemberPost
                  key={`post-${post.id}`}
                  post={post}
                  currentUserAvatar={currentAvatar}
                  onViewMoreComments={() => handleViewPostComments(post.id)}
                  onDeletePost={() => handleDeletePost(post.id)}
                  onEditPost={() => handleEditPost(post.id)}
                />
              );
            })}

            {/* Infinite scroll sentinel element */}
            <div className="w-full my-4">
              {/* Loading indicator for next page */}
              {(isFetchingNextEventsPage || isFetchingNextPostsPage) && (
                <LoadingState
                  message="Loading more content..."
                  className="py-4 text-center"
                />
              )}

              {/* Error state for next page */}
              {(isErrorEvents || isErrorPosts) &&
                !isFetchingNextEventsPage &&
                !isFetchingNextPostsPage && (
                  <div className="flex flex-col items-center py-4">
                    <ErrorState
                      message="Failed to load more content."
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
                ref={sentinelRef}
                className={`w-full ${hasMoreContent ? "h-20" : "h-4"}`}
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

      {/* Post Form Modal */}
      <PostFormModal
        isOpen={isPostFormModalOpen}
        onClose={() => setIsPostFormModalOpen(false)}
        mode={postFormMode}
        postId={selectedPostId || undefined}
      />

      {/* Confirmation Modal for Delete - Handled by useConfirmationModal */}

      {/* Confirmation Modal for Join Organization */}
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

      {/* Confirmation Modal for RSVP - Handled by useConfirmationModal */}
    </div>
  );
}
