import axiosInstance from "@src/shared/api/axios";
import { objectToFormData } from "@src/shared/utils/formDataConverter";
import type { ContentCommentQueryParams } from "@src/shared/utils/QueryParams";
import type {
  PostCommentFormData,
  EditCommentFormData,
} from "../schema/comment.schema";
import type {
  CommentsResponse,
  PostCommentResponse,
  DeleteCommentResponse,
  EditCommentResponse,
} from "../schema/comment.types";

// Posts a new comment with the provided form data (post_id/event_id and message)
export const postComment = async (
  commentData: PostCommentFormData
): Promise<PostCommentResponse> => {
  try {
    // Convert comment data object to FormData
    const formData = objectToFormData(commentData);

    // Determine the endpoint based on whether it's a post or event comment
    const endpoint = commentData.post_id ? "/comment/post/" : "/comment/event/";

    const response = await axiosInstance.post<PostCommentResponse>(
      endpoint,
      formData
    );

    return response.data;
  } catch (error) {
    console.error("Comment posting failed:", error);
    throw error;
  }
};

// Fetches paginated comments for a specific post or event
export const getContentComments = async (
  params: ContentCommentQueryParams
): Promise<CommentsResponse> => {
  try {
    // Determine if we're fetching post or event comments
    const contentType = params.postId ? "post" : "event";
    const contentId = params.postId || params.eventId;

    const response = await axiosInstance.get<CommentsResponse>(
      `/comment/${contentType}/${contentId}`,
      {
        params: {
          limit: params.limit,
          offset: params.offset,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};

// Legacy function to fetch paginated comments for a post
export const getPostComments = async (
  params: ContentCommentQueryParams
): Promise<CommentsResponse> => {
  return getContentComments(params);
};

// Deletes a comment by its ID
export const deleteComment = async (
  commentId: number
): Promise<DeleteCommentResponse> => {
  try {
    const response = await axiosInstance.delete<DeleteCommentResponse>(
      `/comment/${commentId}`
    );

    return response.data;
  } catch (error) {
    console.error("Comment deletion failed:", error);
    throw error;
  }
};

// Edits a comment with the provided form data (comment_id and message)
export const editComment = async (
  commentData: EditCommentFormData
): Promise<EditCommentResponse> => {
  try {
    // Convert comment data object to FormData
    const formData = objectToFormData(commentData);

    const response = await axiosInstance.put<EditCommentResponse>(
      `/comment/${commentData.comment_id}`,
      formData
    );

    return response.data;
  } catch (error) {
    console.error("Comment editing failed:", error);
    throw error;
  }
};
