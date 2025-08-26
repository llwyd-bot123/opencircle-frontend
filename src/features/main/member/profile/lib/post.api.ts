import axiosInstance from "@src/shared/api/axios";
import { objectToFormData } from "@src/shared/utils/formDataConverter";
import type { PostFormData } from "../schema/post.schema";
import type { PostData, MemberPostsResponse, AllMemberPostsResponse } from "../schema/post.types";
import type { UserQueryParams } from "@src/shared/utils/QueryParams";

// Interface for the response from creating or updating a post
export interface PostResponse {
  id: string;
  description: string;
  image_url?: string;
  created_at: string;
  user_id: string;
  // Add other fields as needed based on your API response
}

export type CreatePostResponse = PostResponse;
export type EditPostResponse = PostResponse;

// Creates a new post with the provided data
export const createPost = async (
  postData: PostFormData
): Promise<CreatePostResponse> => {
  try {
    // Convert post data object to FormData
    const formData = objectToFormData(postData, ["image"]);

    const response = await axiosInstance.post<CreatePostResponse>(
      "/post",
      formData
    );

    return response.data;
  } catch (error) {
    console.error("Post creation failed:", error);
    throw error;
  }
};

// Updates an existing post with the provided data
export const updatePost = async (
  postId: number,
  postData: PostFormData
): Promise<EditPostResponse> => {
  try {
    // Convert post data object to FormData
    const formData = objectToFormData(postData, ["image"]);

    const response = await axiosInstance.put<EditPostResponse>(
      `/post/${postId}`,
      formData
    );

    return response.data;
  } catch (error) {
    console.error("Post update failed:", error);
    throw error;
  }
};

// Deletes a post by its ID
export const deletePost = async (postId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/post/${postId}`);
  } catch (error) {
    console.error("Post deletion failed:", error);
    throw error;
  }
};

// Fetches a single post by its ID
export const getPostById = async (postId: number): Promise<PostData> => {
  try {
    const response = await axiosInstance.get<PostData>(
      `/post/single/${postId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch post with ID ${postId}:`, error);
    throw error;
  }
};

/**
 * Fetches posts with comments for a specific member
 * @param uid - User ID of the member (UUID string)
 * @param page - Page number for pagination (default: 1)
 * @param pageSize - Number of posts per page (default: 5)
 * @returns Promise with the paginated posts response
 */
export const getMemberPostsWithComments = async (
  params?: UserQueryParams
): Promise<MemberPostsResponse> => {
  try {
    const response = await axiosInstance.get<MemberPostsResponse>(
      `/post/${params?.uid}/with_comments`,
      {
        params: {
          page: params?.page,
          page_size: params?.per_page,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch member posts:", error);
    throw error;
  }
};

// Fetches all member posts with pagination
export const getAllMemberPosts = async (
  page: number = 1,
  pageSize: number = 5
): Promise<AllMemberPostsResponse> => {
  try {
    const response = await axiosInstance.get<AllMemberPostsResponse>(
      "/post/all",
      {
        params: {
          page,
          page_size: pageSize,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch all member posts:", error);
    throw error;
  }
};
