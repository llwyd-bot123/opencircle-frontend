import { useImageUrl, useFormatDate, checkOwnership } from "@src/shared/hooks";
import { useNavigation } from "@src/shared/hooks/useNavigation";
import { useAuthStore } from "@src/shared/store";
import { isMember } from "@src/shared/utils";
import { type AllMemberPostData } from "@src/features/main/member/profile/schema/post.types";
import avatarImage from "@src/assets/shared/avatar.png";

interface SharedMemberPostProps {
  post: AllMemberPostData;
}

export const SharedMemberPost = ({ post }: SharedMemberPostProps) => {
  const { getImageUrl } = useImageUrl();
  const { formatRelativeTime } = useFormatDate();
  const { onMemberClick } = useNavigation();
  const isOwner = checkOwnership({ type: "post", ownerId: post.author_id });
  const imageUrls = (post.images || []).map((img) => getImageUrl(img?.directory, img?.filename, ""));

  const { user } = useAuthStore();
  const authorImageUrl = getImageUrl(
    isMember(user) ? post.author_profile_picture?.directory : post.author_logo?.directory,
    isMember(user) ? post.author_profile_picture?.filename : post.author_logo?.filename,
    avatarImage
  );

  return (
    <div className="bg-athens_gray rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 w-full">
      <div className="flex flex-row items-center justify-between mb-4">
        <div className="flex flex-row items-center space-x-2 sm:space-x-3">
          <img
            src={authorImageUrl}
            alt="Post Author"
            className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full object-cover ${
              isOwner ? "" : "border border-transparent hover:border-secondary cursor-pointer"
            }`}
            onClick={isOwner ? undefined : onMemberClick(post.author_uuid)}
          />
          <div className="flex flex-col">
            <h4 className="text-primary text-responsive-xs">
              {post.author_organization_name ? post.author_organization_name : `${post.author_first_name} ${post.author_last_name}`} {" "}
              <span className="text-authlayoutbg">posted</span>
            </h4>
            <p className="text-placeholderbg text-responsive-xxs">{formatRelativeTime(post.created_date)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-3 sm:p-4 rounded-xl text-responsive-xs text-primary leading-relaxed">
        <p>{post.description}</p>
      </div>

      {imageUrls.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          {imageUrls.slice(0, 4).map((src, idx) => (
            <div key={idx} className="w-full h-40 sm:h-48 md:h-56 lg:h-[300px] rounded-lg overflow-hidden relative">
              <img src={src} alt={`Post image ${post.id}-${idx + 1}`} className="w-full h-full object-cover" />
              {idx === 3 && imageUrls.length > 4 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-bold text-responsive-lg">
                  + {imageUrls.length - 4}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
