import { useState } from "react";

import { MemberPost } from "./subcomponents/MemberPost";
// import { CommentsModal } from "@src/shared/components/modals";
import { PostFormModal } from "@src/shared/components/modals/PostFormModal";
import { useAuthStore } from "@src/shared/store/auth";
import {
  useConfirmationModal,
  useImageUrl,
  useInfiniteScroll,
} from "@src/shared/hooks";
import avatarImage from "@src/assets/shared/avatar.png";
import { isMember, isOrganization } from "@src/shared/utils";
import {
  CommentsModal,
  ConfirmationModal,
} from "@src/shared/components/modals";
import { LoadingState, ErrorState } from "@src/shared/components";
import { useInfinitePostComments } from "@src/features/comments/model/comment.infinite.query";
import type { CommentsResponse } from "@src/features/comments/schema/comment.types";
import { useInfiniteMemberPosts } from "../model/post.infinite.query";
import { useDeletePost } from "../model/post.mutation";
import type { MemberPostsResponse } from "../schema/post.types";
import type { PostFormMode } from "../schema/post.schema";

export default function PostComponent() {
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [isPostFormModalOpen, setIsPostFormModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [postFormMode, setPostFormMode] = useState<PostFormMode>("create");
  const deletePostMutation = useDeletePost();

  const {
    isConfirmModalOpen,
    modalConfig,
    openConfirmationModal,
    closeConfirmationModal,
  } = useConfirmationModal();

  const { user } = useAuthStore();
  const { getImageUrl } = useImageUrl();

  // Get current user avatar URL
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

  // Only fetch posts if user is logged in using infinite query
  const {
    data: infinitePostsData,
    isLoading: isPostsLoading,
    error: postsError,
    fetchNextPage: fetchNextPostsPage,
    hasNextPage: hasNextPostsPage,
    isFetchingNextPage: isFetchingNextPostsPage,
    isError: isPostsError,
  } = useInfiniteMemberPosts({
    uid: user?.uuid || "",
    limit: 5,
  });

  // Ensure fetchNextPostsPage is properly typed
  const handleFetchNextPage = () => {
    if (fetchNextPostsPage) {
      console.log("Fetching next page of posts");
      fetchNextPostsPage();
    } else {
      console.error("fetchNextPostsPage function is not available");
    }
  };

  // Flatten the pages of posts into a single array
  const postsData =
    infinitePostsData?.pages?.flatMap(
      (page: MemberPostsResponse) => page.posts
    ) || [];

  const {
    data: infiniteCommentsData,
    isLoading: isCommentsLoading,
    error: commentsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePostComments({
    postId: selectedPostId || 0,
    limit: 5,
  });

  // Flatten the pages of comments into a single array
  const comments =
    infiniteCommentsData?.pages?.flatMap(
      (page: CommentsResponse) => page.comments
    ) || [];
  // Get the total number of comments from the first page
  const totalComments = infiniteCommentsData?.pages?.[0]?.total || 0;

  const handleViewMoreComments = (postId: number) => {
    setSelectedPostId(postId);
    setIsCommentsModalOpen(true);
  };

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

  const handleOpenCreatePostModal = () => {
    setPostFormMode("create");
    setSelectedPostId(null);
    setIsPostFormModalOpen(true);
  };

  const handleEditPost = (postId: number) => {
    setPostFormMode("edit");
    setSelectedPostId(postId);
    setIsPostFormModalOpen(true);
  };

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: handleFetchNextPage,
    hasMore: !!hasNextPostsPage,
    isLoading: isFetchingNextPostsPage,
    rootMargin: "0px 0px 100px 0px", // Increase detection area
    threshold: 0,
    enabled: true, // Always enable
  });

  return (
    <div className="w-full lg:w-1/2 mx-auto p-8">
      <>
        {/* Comment Card */}
        <div className="bg-white rounded-xl h-auto sm:h-[104px] p-3 py-2 sm:p-4 shadow-sm border border-gray-100 mb-6">
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
                placeholder="Whats on your mind? ..."
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-athens_gray border border-transparent rounded-full text-responsive-xs sm:text-responsive-sm cursor-pointer"
                onClick={handleOpenCreatePostModal}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Post Form Modal (Create/Edit) */}
        <PostFormModal
          isOpen={isPostFormModalOpen}
          onClose={() => setIsPostFormModalOpen(false)}
          mode={postFormMode}
          postId={selectedPostId || undefined}
        />

        {/* Loading State */}
        {isPostsLoading && <LoadingState message="Loading posts..." />}

        {/* Error State */}
        {postsError && (
          <ErrorState message="Failed to load posts. Please try again later." />
        )}

        {/* No Posts State */}
        {!isPostsLoading && !postsError && postsData?.length === 0 && (
          <div className="text-center py-8">
            <p className="text-placeholderbg text-responsive-sm">
              No posts yet. Be the first to share something!
            </p>
          </div>
        )}

        {/* Posts List */}
        {!isPostsLoading &&
          !postsError &&
          postsData &&
          postsData.length > 0 && (
            <div className="space-y-6">
              {postsData.map((post) => (
                <MemberPost
                  key={post.id}
                  post={post}
                  currentUserAvatar={currentAvatar}
                  onViewMoreComments={() => handleViewMoreComments(post.id)}
                  onDeletePost={handleDeletePost}
                  onEditPost={handleEditPost}
                />
              ))}

              {/* Infinite scroll sentinel element */}
              <div className="w-full my-4">
                {isFetchingNextPostsPage && (
                  <LoadingState
                    message="Loading more posts..."
                    className="py-4 text-center"
                  />
                )}
                {isPostsError && !isFetchingNextPostsPage && (
                  <div className="flex flex-col items-center py-4">
                    <ErrorState
                      message="Failed to load more posts."
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
                  className={`w-full ${hasNextPostsPage ? "h-20" : "h-4"}`}
                  style={{ marginBottom: "20px" }}
                />
              </div>
            </div>
          )}

        {/* Comments Modal */}
        <CommentsModal
          isOpen={isCommentsModalOpen}
          onClose={() => setIsCommentsModalOpen(false)}
          comments={comments}
          currentUserAvatar={currentAvatar}
          isLoading={isCommentsLoading}
          error={commentsError}
          postId={selectedPostId || 0}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
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
      </>
    </div>
  );
}
