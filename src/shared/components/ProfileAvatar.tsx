import { useNavigation } from "@src/shared/hooks/useNavigation";
import avatarImage from "@src/assets/shared/avatar.png";

interface ProfileAvatarProps {
  src: string;
  alt?: string;
  type: "member" | "organization";
  isOwner: boolean;
  memberUuid?: string;
  organizationId?: number;
  className?: string;
  name?: string;
  nameClassName?: string;
  containerClassName?: string;
  children?: React.ReactNode;
}

export const ProfileAvatar = ({
  src,
  alt = "Profile Avatar",
  type,
  isOwner,
  memberUuid,
  organizationId,
  className = "",
  name,
  nameClassName = "",
  containerClassName = "flex items-center gap-3",
  children,
}: ProfileAvatarProps) => {
  const { onMemberClick, onOrganizationClick } = useNavigation();

  const handleClick = (e: React.MouseEvent) => {
    if (isOwner) return;

    if (type === "organization") {
      if (organizationId) {
        onOrganizationClick(organizationId)(e);
      } else {
        console.warn(
          "ProfileAvatar: type is organization but organizationId is missing"
        );
      }
    } else {
      if (memberUuid) {
        onMemberClick(memberUuid)(e);
      } else {
        console.warn("ProfileAvatar: type is member but memberUuid is missing");
      }
    }
  };

  const Image = (
    <img
      src={src}
      alt={alt}
      className={`rounded-full object-cover ${
        isOwner
          ? ""
          : "border border-transparent hover:border-secondary cursor-pointer"
      } ${className}`}
      onError={(e) => (e.currentTarget.src = avatarImage)}
      onClick={isOwner ? undefined : handleClick}
    />
  );

  if (!name && !children) {
    return Image;
  }

  return (
    <div className={containerClassName}>
      {Image}
      <div className="flex flex-col">
        {name && (
          <span
            className={`${nameClassName} ${
              isOwner ? "" : "hover:underline cursor-pointer"
            }`}
            onClick={isOwner ? undefined : handleClick}
          >
            {name}
          </span>
        )}
        {children}
      </div>
    </div>
  );
};
