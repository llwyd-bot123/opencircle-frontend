import { useState, useEffect, useCallback } from "react";
import addImageIcon from "@src/assets/shared/add_image_icon.svg";
import { Modal } from "../Modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createPostSchema,
  editPostSchema,
  type PostFormData,
  type PostFormMode,
} from "@src/features/main/member/profile/schema/post.schema";
import {
  useCreatePost,
  useUpdatePost,
} from "@src/features/main/member/profile/model/post.mutation";
import { useImageUrl } from "@src/shared/hooks";
import { useGetPost } from "@src/features/main/member/profile/model/post.query";

interface PostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: PostFormMode;
  postId?: number;
}

export const PostFormModal = ({
  isOpen,
  onClose,
  mode = "create",
  postId,
}: PostFormModalProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();

  // Fetch post data if in edit mode
  const { data: postData, isLoading: isLoadingPost } = useGetPost(
    postId || 0,
    mode === "edit" && !!postId
  );

  // Track previous mode to detect changes
  const [prevMode, setPrevMode] = useState<PostFormMode>(mode);

  // Initialize React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(
      mode === "create" ? createPostSchema : editPostSchema
    ),
    defaultValues: {
      description: "",
      image: undefined,
    },
    mode: "onChange",
  });

  const { getImageUrl } = useImageUrl();

  /**
   * Custom reset function that clears form fields and image preview
   */
  const resetForm = useCallback(() => {
    // Reset React Hook Form fields
    reset({
      description: "",
      image: undefined,
    });

    // Clear image preview
    setImagePreview(null);

    // Clear any error messages
    setError("");
  }, [reset]);

  // Reset form when modal closes or when switching between create/edit modes
  useEffect(() => {
    // If modal is closed, reset the form
    if (!isOpen) {
      resetForm();
      return;
    }

    // If mode changed from edit to create, reset the form
    if (prevMode === "edit" && mode === "create") {
      resetForm();
    }

    // Update previous mode
    setPrevMode(mode);
  }, [isOpen, mode, prevMode, reset, resetForm]);

  // Set form values when post data is loaded in edit mode
  useEffect(() => {
    if (mode === "edit" && postData) {
      setValue("description", postData.description);

      // Set image preview if available
      if (
        postData.image &&
        postData.image.directory &&
        postData.image.filename
      ) {
        const imageUrl = getImageUrl(
          postData.image.directory,
          postData.image.filename,
          "avatar"
        );
        setImagePreview(imageUrl);
      }
    }
  }, [mode, postData, setValue, getImageUrl]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Set the file in the form
      setValue("image", file);

      // Create image preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Handle form submission with validated data
   */
  const onSubmit = handleSubmit(async (data) => {
    // Clear any previous error messages
    setError("");

    try {
      if (mode === "create") {
        // Wait for the post creation mutation to complete
        await createPostMutation.mutateAsync(data);
      } else if (mode === "edit" && postId) {
        // For edit mode, only include the image if a new one was selected
        // This prevents the backend from removing the existing image when only description is changed
        const postDataToUpdate = { ...data };

        // If no new image was selected, remove the image field completely
        // to prevent the backend from clearing the existing image
        if (data.image === undefined) {
          delete postDataToUpdate.image;
        }

        // Wait for the post update mutation to complete
        await updatePostMutation.mutateAsync({
          postId,
          postData: postDataToUpdate,
        });
      }

      // Reset form after successful operation
      resetForm();

      // Close the modal
      onClose();
    } catch (error: unknown) {
      // Handle errors
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(String(error)); // fallback in case it's not an Error object
      }
    }
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      {/* Header */}
      <div className="relative p-6 border-b border-gray-100">
        <h2 className="text-responsive-base font-bold text-primary text-center">
          {mode === "create" ? "Create Post" : "Edit Post"}
        </h2>
        <button
          onClick={onClose}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 text-placeholderbg hover:text-primary transition-colors text-responsive-xs"
        >
          Close
        </button>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="p-6 space-y-6">
        {/* Description */}
        <div>
          <label className="block text-primary font-bold mb-2 text-responsive-xs">
            Description
          </label>
          <textarea
            {...register("description")}
            placeholder="Please type your event description"
            rows={4}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-responsive-xs"
          />
          {errors.description && (
            <p className="mt-1 text-responsive-xxs text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Add Image */}
        <div className="text-center">
          <label className="inline-flex items-center cursor-pointer text-primary hover:text-opacity-80 transition-colors">
            <img src={addImageIcon} alt="Add Image" className="w-5 h-5 mr-1" />
            <span className="font-bold text-responsive-xs">Add Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Image Preview"
                className="h-64 w-full mx-auto rounded-lg object-cover border border-gray-200"
              />
            </div>
          )}
          {errors.image && (
            <p className="mt-1 text-responsive-xxs text-red-600">{errors.image.message}</p>
          )}
        </div>

        {/* Divider */}
        <hr className="border-gray-200" />

        {/* API Error Message */}
        {error && <p className="text-red-500 text-responsive-xxs mb-4">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-primary text-white py-3 sm:py-4 rounded-full font-medium hover:bg-opacity-90 transition-colors text-responsive-xs"
          disabled={
            createPostMutation.isPending ||
            updatePostMutation.isPending ||
            isLoadingPost
          }
        >
          {createPostMutation.isPending || updatePostMutation.isPending
            ? mode === "create"
              ? "Posting..."
              : "Updating..."
            : mode === "create"
            ? "Post"
            : "Update Post"}
        </button>
      </form>
    </Modal>
  );
};
