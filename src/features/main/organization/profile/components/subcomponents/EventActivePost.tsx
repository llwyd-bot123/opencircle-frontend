import { useState } from "react";
import { DropdownMenu } from "@src/shared/components/DropdownMenu";
import { EventTabContent } from "@src/shared/components/EventTabContent";
import { CommentsSection } from "@src/features/comments/ui/CommentsSection";
import { useFormatDate, useImageUrl, checkOwnership } from "@src/shared/hooks";
import avatarImage from "@src/assets/shared/avatar.png";
import type { EventData } from "../../schema/event.type";

interface EventActivePostProps {
  event: EventData;
  currentUserAvatar: string;
  onViewMoreComments?: (eventId: number) => void;
  onViewMoreMembers?: (eventId: number) => void;
  onViewMoreRequests?: (eventId: number) => void;
  onEdit?: (eventId: number) => void;
  onDelete?: (eventId: number) => void;
}

export const EventActivePost = ({
  event,
  currentUserAvatar,
  onViewMoreComments,
  onViewMoreMembers,
  onViewMoreRequests,
  onEdit,
  onDelete,
}: EventActivePostProps) => {
  const [activeTab, setActiveTab] = useState<"members" | "request">("members");
  const { formatRelativeTime, formatFriendlyDateTime } = useFormatDate();

  const { getImageUrl } = useImageUrl();
  const eventImageUrl = getImageUrl(
    event.image.directory,
    event.image.filename,
    ""
  );

  const creatorImageUrl = getImageUrl(
    event.organization.logo.directory,
    event.organization.logo.filename,
    avatarImage
  );

  const handleDelete = () => {
    onDelete?.(event.id);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(event.id);
    }
  };

  const handleViewMoreComments = () => {
    onViewMoreComments?.(event.id);
  };

  const handleViewMoreMembers = () => {
    onViewMoreMembers?.(event.id);
  };

  const handleViewMoreRequests = () => {
    onViewMoreRequests?.(event.id);
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
      {/* 1. Header with Avatar, Name, Time and 3-dot menu */}
      <div className="flex flex-row items-start justify-between mb-4">
        <div className="flex flex-row items-center space-x-2 sm:space-x-3">
          <img
            src={creatorImageUrl}
            alt="Event Creator"
            className="w-10 h-10 sm:w-14 sm:h-14 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <h4 className="text-primary text-responsive-xs font-bold">
              {event.organization.name}{" "}
              <span className="text-authlayoutbg font-normal">
                posted an event
              </span>
            </h4>
            <p className="text-placeholderbg text-responsive-xxs">
              {formatRelativeTime(event.created_date)}
            </p>
          </div>
        </div>

        <div className="flex items-start">
          {/* Horizontal 3-dot menu - only show if the event is from the authenticated user */}
          {checkOwnership({
            type: "event",
            ownerId: event.organization.account_id,
          }) && (
            <DropdownMenu
              onEdit={handleEdit}
              onDelete={handleDelete}
              editLabel="Edit Event"
              deleteLabel="Delete Event"
            />
          )}
        </div>
      </div>

      {/* 2. Post Title */}
      <h3 className="text-responsive-sm font-bold text-primary mb-4 mt-1">
        {event.title}
      </h3>

      {/* 3. Location */}
      <div className="flex items-center mb-4">
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-primary mr-1 sm:mr-2 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-primary text-responsive-xs">
          {event.address?.house_building_number}, {event.address?.barangay},{" "}
          {event.address?.city}
        </span>
      </div>

      {/* 4. Time of Event */}
      <div className="flex items-center mb-4">
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-primary mr-1 sm:mr-2 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-primary text-responsive-xs">
          {formatFriendlyDateTime(event.event_date)}
        </span>
      </div>

      {/* 5. Description */}
      <div className="bg-athens_gray p-3 sm:p-4 rounded-xl text-responsive-xs text-primary leading-relaxed">
        <p>{event.description}</p>
      </div>

      {/* 6. Event Image */}
      <div className="w-full h-40 sm:h-48 md:h-56 lg:h-[300px] overflow-hidden mt-4">
        <img
          src={eventImageUrl}
          alt={event.title}
          className="w-full h-full object-cover"
        />
      </div>

      <hr className="my-4 text-gainsboro" />

      {/* 7. Members & Request */}
      <div className="">
        {/* Tab Navigation */}
        <div className="flex">
          <button
            onClick={() => setActiveTab("members")}
            className={`px-4 py-[2px] text-responsive-xs sm:text-responsive-sm transition-colors duration-200 ${
              activeTab === "members"
                ? "text-primary font-bold"
                : "text-placeholderbg hover:text-primary"
            }`}
          >
            Members
          </button>

          {/* Vertical Divider */}
          <div className="w-px bg-primary mx-2 my-1"></div>

          <button
            onClick={() => setActiveTab("request")}
            className={`px-4 py-[2px] text-responsive-xs sm:text-responsive-sm transition-colors duration-200 ${
              activeTab === "request"
                ? "text-primary font-bold"
                : "text-placeholderbg hover:text-primary"
            }`}
          >
            Request
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-0">
          <EventTabContent
            activeTab={activeTab}
            members={event.members}
            totalMembers={event.total_members}
            totalRequests={event.total_pending_rsvps}
            requests={event.pending_rsvps}
            onViewMoreMembers={handleViewMoreMembers}
            onViewMoreRequests={handleViewMoreRequests}
          />
        </div>
      </div>

      <hr className="my-4 text-gainsboro" />

      {/* 8. Comments Section */}
      <CommentsSection
        contentType="event"
        comments={event.limited_comments}
        totalComments={event.total_comments || 0}
        currentUserAvatar={currentUserAvatar}
        onViewMoreComments={handleViewMoreComments}
        contentId={event.id}
      />
    </div>
  );
};
