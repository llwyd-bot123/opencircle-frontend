import { useState, useRef } from "react";
import type { KeyboardEvent } from "react";
import type {
  CommentsSectionProps,
  ContentComment,
} from "../schema/comment.types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  postCommentSchema,
  type PostCommentFormData,
  type EditCommentFormData,
} from "../schema/comment.schema";
import {
  usePostComment,
  useDeleteComment,
  useEditComment,
} from "../model/comment.mutation";
import { useImageUrl, checkOwnership, useFormatDate } from "@src/shared/hooks";
import avatarImage from "@src/assets/shared/avatar.png";
import { DropdownMenu } from "@src/shared/components/DropdownMenu";

export function CommentsSection({
  comments = [],
  totalComments = 0,
  currentUserAvatar = avatarImage,
  onViewMoreComments,
  contentId,
  contentType = "post", // Default to post for backward compatibility
}: CommentsSectionProps) {
  const [error, setError] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);
  const displayedComments = comments.slice(0, 3);
  const hasMoreComments = totalComments > 3;
  const postCommentMutation = usePostComment();
  const deleteCommentMutation = useDeleteComment();
  const editCommentMutation = useEditComment();
  const { formatRelativeTime } = useFormatDate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostCommentFormData>({
    resolver: zodResolver(postCommentSchema),
    defaultValues: {
      ...(contentType === "post"
        ? { post_id: contentId }
        : { event_id: contentId }),
      message: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    setError("");

    try {
      await postCommentMutation.mutateAsync(data);
      reset({
        ...(contentType === "post"
          ? { post_id: contentId }
          : { event_id: contentId }),
        message: "",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(String(error));
      }
    }
  });

  const { getImageUrl } = useImageUrl();

  const handleEditComment = (comment: ContentComment) => {
    setEditingCommentId(comment.comment_id);
    setEditingCommentText(comment.message);
    setTimeout(() => {
      if (editInputRef.current) {
        editInputRef.current.focus();
      }
    }, 0);
  };

  const saveEditedComment = async () => {
    if (!editingCommentId) return;

    try {
      const editData: EditCommentFormData = {
        comment_id: editingCommentId,
        message: editingCommentText,
      };

      await editCommentMutation.mutateAsync(editData);
      setEditingCommentId(null);
      setEditingCommentText("");
    } catch (error) {
      setError(String(error));
    }
  };

  const handleEditKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveEditedComment();
    } else if (e.key === "Escape") {
      setEditingCommentId(null);
      setEditingCommentText("");
    }
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteCommentMutation.mutateAsync(commentId);
    } catch (error) {
      setError(String(error));
    }
  };

  return (
    <div className="w-full max-w-full px-2 sm:px-3 md:px-4">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-2 sm:mb-3 md:mb-4">
        <h4 className="text-responsive-xs font-semibold text-primary">
          Comments
        </h4>
        {hasMoreComments && (
          <button
            onClick={onViewMoreComments}
            className="text-primary text-responsive-xs hover:underline transition-all duration-200"
          >
            <span className="hidden sm:inline">
              View more comments ({Math.min(3, comments.length)} of{" "}
              {totalComments})
            </span>
            <span className="sm:hidden">
              View more ({Math.min(3, comments.length)}/{totalComments})
            </span>
          </button>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-2 sm:space-y-3 md:space-y-4 mb-2 sm:mb-3 md:mb-4">
        {displayedComments.length > 0 ? (
          displayedComments.map((comment) => (
            <div key={comment.comment_id} className="w-full">
              <div className="bg-athens_gray p-2 sm:p-3 rounded-lg sm:rounded-xl flex justify-between items-start sm:items-center">
                <div className="flex space-x-2 sm:space-x-3 flex-1">
                  {comment.user && Object.keys(comment.user).length > 0 ? (
                    <img
                      src={getImageUrl(
                        comment.user.profile_picture.directory,
                        comment.user.profile_picture.filename,
                        "avatar"
                      )}
                      alt={`${comment.user.first_name} ${comment.user.last_name} avatar`}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                    />
                  ) : comment.organization &&
                    Object.keys(comment.organization).length > 0 ? (
                    <img
                      src={getImageUrl(
                        comment.organization.logo.directory,
                        comment.organization.logo.filename,
                        "logo"
                      )}
                      alt={`${comment.organization.name} logo`}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                    />
                  ) : (
                    <img
                      src={avatarImage}
                      alt="Default avatar"
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-primary font-medium text-responsive-xxs mb-1">
                      {comment.user && Object.keys(comment.user).length > 0
                        ? `${comment.user.first_name} ${comment.user.last_name}`
                        : comment.organization &&
                          Object.keys(comment.organization).length > 0
                        ? comment.organization.name
                        : "Unknown"}
                    </p>
                    {editingCommentId === comment.comment_id ? (
                      <div className="relative">
                        <input
                          ref={editInputRef}
                          type="text"
                          value={editingCommentText}
                          onChange={(e) =>
                            setEditingCommentText(e.target.value)
                          }
                          onKeyDown={handleEditKeyPress}
                          onBlur={cancelEditing}
                          className="w-full px-2 sm:px-3 py-1 sm:py-2 bg-white border border-primary rounded-full text-primary text-responsive-xs"
                          autoFocus
                        />
                        <div className="absolute right-2 top-1 sm:top-2 text-responsive-xs text-primary-75">
                          Press Enter to save
                        </div>
                      </div>
                    ) : (
                      <p className="text-primary text-responsive-xs line-clamp-3">
                        {comment.message}
                      </p>
                    )}
                  </div>
                </div>
                {checkOwnership({
                  type: "comment",
                  accountId: comment.account.id,
                }) && (
                  <DropdownMenu
                    onEdit={() => handleEditComment(comment)}
                    onDelete={() => handleDeleteComment(comment.comment_id)}
                    className="ml-2"
                    editLabel="Edit Comment"
                    deleteLabel="Delete Comment"
                  />
                )}
              </div>
              <p className="text-placeholderbg text-responsive-xxs mt-1 ml-2 sm:ml-3">
                {formatRelativeTime(comment.created_date)}
              </p>
            </div>
          ))
        ) : (
          <p className="text-placeholderbg text-responsive-sm text-center py-2 sm:py-3 md:py-4">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>

      {/* Post Comment Form */}
      <form onSubmit={onSubmit} className="flex flex-col py-2 sm:py-3 md:py-4">
        <div className="flex space-x-2 sm:space-x-3 items-center">
          <img
            src={currentUserAvatar}
            alt="Your Avatar"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
          />
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Post a comment... (Press Enter to submit)"
              {...register("message")}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-athens_gray border ${
                errors.message ? "border-red-500" : "border-transparent"
              } rounded-full text-responsive-xs`}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onSubmit();
                }
              }}
            />
          </div>
        </div>
        <div className="mt-1 ml-10 sm:ml-13">
          {errors.message && (
            <p className="text-red-500 text-responsive-xs ml-8 sm:ml-10">
              {errors.message.message}
            </p>
          )}
          {error && (
            <p className="text-red-500 text-responsive-xs ml-8 sm:ml-10">
              {error}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
