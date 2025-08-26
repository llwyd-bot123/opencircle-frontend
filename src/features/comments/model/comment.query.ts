import { useQuery } from "@tanstack/react-query";
import type { ContentCommentQueryParams } from "@src/shared/utils/QueryParams";
import type { CommentsResponse } from "../schema/comment.types";
import { getContentComments } from "../lib";
import { QUERY_KEYS } from "@src/shared/constants/queryKeys";

// Hook for fetching comments for a specific content (post or event) with pagination
export const useContentComments = (params: ContentCommentQueryParams) => {
  return useQuery<CommentsResponse, Error>({
    queryKey: [QUERY_KEYS.EVENT_COMMENTS, params],
    queryFn: () => getContentComments(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!(params.postId || params.eventId), // Only run the query if either postId or eventId is provided
  });
};

// Hook for fetching comments for a specific post with pagination (legacy function)
export const usePostComments = (params: ContentCommentQueryParams) => {
  return useContentComments(params);
};
