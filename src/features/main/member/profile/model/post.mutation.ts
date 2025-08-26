import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPost,
  updatePost,
  deletePost,
  type CreatePostResponse,
  type EditPostResponse,
} from "../lib/post.api";
import type { PostFormData } from "../schema/post.schema";
import { QUERY_KEYS } from "@src/shared/constants/queryKeys";

// Custom hook for handling post creation functionality using TanStack Query
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation<CreatePostResponse, Error, PostFormData>({
    mutationFn: (postData) => createPost(postData),
    onSuccess: () => {
      // Success handling can be implemented here
      // For example, invalidating queries to refresh post list
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEMBER_POSTS],
      });
    },
    onError: (error) => {
      console.error("Post creation error:", error);
      // Error handling can be implemented here
    },
  });
};

// Custom hook for handling post update functionality using TanStack Query
export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation<
    EditPostResponse,
    Error,
    { postId: number; postData: PostFormData }
  >({
    mutationFn: ({ postId, postData }) => updatePost(postId, postData),
    onSuccess: (_, variables) => {
      // Invalidate queries to refresh post list
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEMBER_POSTS],
      });
      // Invalidate the specific post query
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.POST, variables.postId],
      });
    },
    onError: (error) => {
      console.error("Post update error:", error);
    },
  });
};

// Custom hook for handling post deletion functionality using TanStack Query
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (postId) => deletePost(postId),
    onSuccess: () => {
      // Invalidate queries to refresh post list
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEMBER_POSTS],
      });
    },
    onError: (error) => {
      console.error("Post deletion error:", error);
    },
  });
};
