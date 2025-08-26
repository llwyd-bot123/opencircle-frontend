import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMemberRequestStatus } from "../lib/member.api";
import { QUERY_KEYS } from "@src/shared/constants/queryKeys";

// Hook for updating a member request status
export const useUpdateMemberRequestStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, status }: { userId: number; status: "approved" | "rejected" }) => 
      updateMemberRequestStatus(userId, status),
    onSuccess: () => {
      // Invalidate and refetch member requests and members
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORGANIZATION_MEMBER_REQUESTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORGANIZATION_MEMBERS] });
    },
  });
};