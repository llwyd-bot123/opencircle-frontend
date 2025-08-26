import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postComment, deleteComment, editComment } from "../lib/comment.api";
import type {
  PostCommentFormData,
  EditCommentFormData,
} from "../schema/comment.schema";
import type {
  PostCommentResponse,
  DeleteCommentResponse,
  EditCommentResponse,
} from "../schema/comment.types";
import { QUERY_KEYS } from "@src/shared/constants/queryKeys";

// Custom hook for handling comment posting functionality using TanStack Query
export const usePostComment = () => {
  const queryClient = useQueryClient();
  return useMutation<PostCommentResponse, Error, PostCommentFormData>({
    mutationFn: (commentData) => postComment(commentData),
    onSuccess: (_, variables) => {
      // Determine if it's a post or event comment
      const isPostComment = !!variables.post_id;

      // Invalidate the content-comments query
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EVENT_COMMENTS],
      });

      // Invalidate the post-comments query for backward compatibility
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.POST_COMMENTS],
      });

      // Invalidate the appropriate content list
      if (isPostComment) {
        // Invalidate member-posts to refresh the post list
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.MEMBER_POSTS],
        });
      } else {
        // Invalidate organization-events to refresh the event list
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ORGANIZATION_ACTIVE_EVENTS],
        });

        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ORGANIZATION_PAST_EVENTS],
        });
        // Invalidate random-events to refresh the event list
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.RANDOM_EVENTS],
        });

        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.MEMBER_EVENTS_BY_RSVP_STATUS],
        });
      }
    },
    onError: (error) => {
      console.error("Comment posting error:", error);
      // Error handling can be implemented here
    },
  });
};

// Custom hook for handling comment deletion functionality using TanStack Query
export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteCommentResponse, Error, number>({
    mutationFn: (commentId) => deleteComment(commentId),
    onSuccess: () => {
      // Invalidate the content-comments query to refresh the comments list
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EVENT_COMMENTS],
      });

      // Invalidate the post-comments query for backward compatibility
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.POST_COMMENTS],
      });

      // Invalidate both member-posts and organization-events to refresh the content lists
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEMBER_POSTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANIZATION_ACTIVE_EVENTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANIZATION_PAST_EVENTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.RANDOM_EVENTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEMBER_EVENTS_BY_RSVP_STATUS],
      });
    },
    onError: (error) => {
      console.error("Comment deletion error:", error);
      // Error handling can be implemented here
    },
  });
};

// Custom hook for handling comment editing functionality using TanStack Query
export const useEditComment = () => {
  const queryClient = useQueryClient();
  return useMutation<EditCommentResponse, Error, EditCommentFormData>({
    mutationFn: (commentData) => editComment(commentData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EVENT_COMMENTS],
      });

      // Invalidate the random-events query to refresh the comments list
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.RANDOM_EVENTS],
      });

      // Invalidate the post-comments query for backward compatibility
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.POST_COMMENTS],
      });

      // Invalidate both member-posts and organization-events to refresh the content lists
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEMBER_POSTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANIZATION_ACTIVE_EVENTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANIZATION_PAST_EVENTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.RANDOM_EVENTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEMBER_EVENTS_BY_RSVP_STATUS],
      });
    },
    onError: (error) => {
      console.error("Comment editing error:", error);
      // Error handling can be implemented here
    },
  });
};
