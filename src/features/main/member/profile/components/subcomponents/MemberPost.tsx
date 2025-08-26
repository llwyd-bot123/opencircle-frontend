// import { CommentsSection } from "@src/shared/components/CommentsSection";
import { DropdownMenu } from "@src/shared/components/DropdownMenu";
import { useImageUrl, useFormatDate, checkOwnership } from "@src/shared/hooks";
import { type PostData } from "@src/features/main/member/profile/schema/post.types";
import avatarImage from "@src/assets/shared/avatar.png";
import { CommentsSection } from "@src/shared/components";

interface MemberPostProps {
  post: PostData;
  currentUserAvatar: string;
  onViewMoreComments?: () => void;
  onDeletePost?: (postId: number) => void;
  onEditPost?: (postId: number) => void;
}

export const MemberPost = ({
  post,
  onViewMoreComments,
  currentUserAvatar,
  onDeletePost,
  onEditPost,
}: MemberPostProps) => {
  const { getImageUrl } = useImageUrl();
  const { formatRelativeTime } = useFormatDate();
  const postImageUrl = getImageUrl(
    post.image.directory,
    post.image.filename,
    ""
  );

  const authorImageUrl = getImageUrl(
    post.author.profile_picture.directory,
    post.author.profile_picture.filename,
    avatarImage
  );

  const handleEdit = () => {
    onEditPost?.(post.id);
  };

  const handleDelete = () => {
    onDeletePost?.(post.id);
  };

  const handleViewMoreComments = () => {
    onViewMoreComments?.();
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 w-full">
      {/* 1. Header with Avatar, Name, Time and 3-dot menu */}
      <div className="flex flex-row items-start justify-between mb-4">
        <div className="flex flex-row items-center space-x-2 sm:space-x-3">
          <img
            src={authorImageUrl}
            alt="Event Creator"
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <h4 className="text-primary text-responsive-xs">
              {post.author.first_name} {post.author.last_name}{" "}
              <span className="text-authlayoutbg">posted</span>
            </h4>
            <p className="text-placeholderbg text-responsive-xxs">
              {formatRelativeTime(post.created_date)}
            </p>
          </div>
        </div>

        {/* Horizontal 3-dot menu - only show if the post is from the authenticated user */}
        {checkOwnership({
          type: "post",
          ownerId: post.author.id,
        }) && (
          <div className="flex-shrink-0">
            <DropdownMenu
              onEdit={handleEdit}
              onDelete={handleDelete}
              editLabel="Edit Post"
              deleteLabel="Delete Post"
            />
          </div>
        )}
      </div>

      {/* 5. Description */}
      <div className="bg-athens_gray p-3 sm:p-4 rounded-lg sm:rounded-xl text-responsive-xs text-primary leading-relaxed">
        <p>{post.description}</p>
      </div>

      {/* 6. Event Image */}
      <div className="w-full h-40 sm:h-48 md:h-56 lg:h-[300px] rounded-lg sm:rounded-xl overflow-hidden mt-4">
        <img
          src={postImageUrl}
          alt={`Post image ${post.id}`}
          className="w-full h-full object-cover"
        />
      </div>

      <hr className="my-4 text-gainsboro" />

      {/* 8. Comments Section */}
      <CommentsSection
        contentType="post"
        contentId={post.id}
        comments={post.comments}
        totalComments={post.total_comments}
        currentUserAvatar={currentUserAvatar}
        onViewMoreComments={handleViewMoreComments}
      />
    </div>
  );
};
