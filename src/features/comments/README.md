# Comments Feature

## Overview
This feature provides functionality for fetching and posting comments for posts.

## API Functions

### `getPostComments`
Fetches comments for a specific post with pagination.

```typescript
getPostComments(postId: number, limit?: number, offset?: number): Promise<CommentsResponse>
```

**Parameters:**
- `postId`: ID of the post to fetch comments for
- `limit`: Number of comments to fetch per page (default: 5)
- `offset`: Offset for pagination (default: 0)

**Example:**
```typescript
import { getPostComments } from "@src/features/comments/lib/comment.api";

// Fetch first 5 comments for post with ID 5
const comments = await getPostComments(5, 5, 0);
```

### `postComment`
Posts a new comment with the provided data.

```typescript
postComment(commentData: PostCommentFormData): Promise<PostCommentResponse>
```

## Query Hooks

### `usePostComments`
Hook for fetching comments for a specific post with pagination.

```typescript
usePostComments(postId: number, limit?: number, offset?: number)
```

**Example:**
```typescript
import { usePostComments } from "@src/features/comments/model/comment.query";

function CommentsList({ postId }) {
  const { data, isLoading, error } = usePostComments(postId, 10, 0);
  
  if (isLoading) return <p>Loading comments...</p>;
  if (error) return <p>Error loading comments: {error.message}</p>;
  
  return (
    <div>
      {data?.comments.map(comment => (
        <div key={comment.comment_id}>
          <p>{comment.message}</p>
          <p>By: {comment.user.first_name} {comment.user.last_name}</p>
        </div>
      ))}
    </div>
  );
}
```

### `usePostComment`
Hook for posting a new comment.

**Example:**
```typescript
import { usePostComment } from "@src/features/comments/model/comment.mutation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postCommentSchema } from "@src/features/comments/schema/comment.schema";

function CommentForm({ postId }) {
  const postCommentMutation = usePostComment();
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(postCommentSchema),
    defaultValues: {
      post_id: postId,
      message: "",
    },
  });
  
  const onSubmit = async (data) => {
    try {
      await postCommentMutation.mutateAsync(data);
      reset({ post_id: postId, message: "" });
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="text" {...register("message")} placeholder="Write a comment..." />
      <button type="submit" disabled={postCommentMutation.isPending}>
        {postCommentMutation.isPending ? "Posting..." : "Post"}
      </button>
    </form>
  );
}
```